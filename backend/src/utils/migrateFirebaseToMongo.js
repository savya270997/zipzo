import dotenv from "dotenv";
import mongoose from "mongoose";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Product } from "../models/Product.js";
import { Cart } from "../models/Cart.js";
import { Order } from "../models/Order.js";
import { Subscription } from "../models/Subscription.js";
import { generateOrderNumber } from "./generateOrderNumber.js";

dotenv.config();

const firebaseCollections = ["users", "products", "carts", "orders", "subscriptions"];

const parseDate = (value) => {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  if (typeof value?.toDate === "function") return value.toDate();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const productKey = (product) =>
  `${product.name}::${product.brand}::${product.category}`.trim().toLowerCase();

const buildFirebaseDb = () => {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
      })
    });
  }

  const db = getFirestore();
  db.settings({ preferRest: true });
  return db;
};

const migratedOrderNumber = (sourceId) => {
  const upper = sourceId.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const letters = (upper.replace(/[^A-Z]/g, "") + "ORDR").slice(0, 4);
  const digits = (upper.replace(/\D/g, "") + "00000000").slice(0, 8);
  return `${letters}${digits}`;
};

const migrateProducts = async (firebaseProducts) => {
  const mongoProducts = await Product.find({});
  const byKey = new Map(mongoProducts.map((product) => [productKey(product), product]));
  const productIdMap = new Map();
  let created = 0;
  let updated = 0;

  for (const doc of firebaseProducts.docs) {
    const data = doc.data();
    const key = productKey(data);
    const payload = {
      name: data.name,
      description: data.description,
      category: data.category,
      brand: data.brand,
      weight: data.weight,
      price: data.price,
      mrp: data.mrp,
      stock: data.stock,
      image: data.image,
      rating: data.rating,
      isFeatured: data.isFeatured,
      tags: data.tags || [],
      priceComparisons: data.priceComparisons || []
    };

    if (byKey.has(key)) {
      const existing = byKey.get(key);
      Object.assign(existing, payload);
      await existing.save();
      productIdMap.set(doc.id, existing._id);
      updated += 1;
    } else {
      const createdProduct = await Product.create(payload);
      byKey.set(key, createdProduct);
      productIdMap.set(doc.id, createdProduct._id);
      created += 1;
    }
  }

  return { productIdMap, created, updated };
};

const migrateUsers = async (firebaseUsers) => {
  const userIdMap = new Map();
  let upserted = 0;

  for (const doc of firebaseUsers.docs) {
    const data = doc.data();
    const user = await User.findOneAndUpdate(
      { email: data.email },
      {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role || "customer",
        loyaltyPoints: data.loyaltyPoints || 0,
        addresses: data.addresses || [],
        purchasePreferences: data.purchasePreferences || [],
        createdAt: parseDate(data.createdAt),
        updatedAt: parseDate(data.updatedAt)
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    userIdMap.set(doc.id, user._id);
    upserted += 1;
  }

  return { userIdMap, upserted };
};

const resolveProductId = (item, productIdMap, firebaseProductDocs) => {
  const sourceId = typeof item === "string" ? item : item?._id || item?.product || item?.product?._id;
  if (sourceId && productIdMap.has(sourceId)) {
    return productIdMap.get(sourceId);
  }

  const fallback = firebaseProductDocs.get(sourceId);
  if (!fallback) return null;

  return productIdMap.get(fallback.id) || null;
};

const migrateCarts = async (firebaseCarts, userIdMap, productIdMap, firebaseProductDocs) => {
  let upserted = 0;

  for (const doc of firebaseCarts.docs) {
    const data = doc.data();
    const userId = userIdMap.get(data.user || doc.id);
    if (!userId) continue;

    const items = (data.items || [])
      .map((item) => {
        const product = resolveProductId(item.product, productIdMap, firebaseProductDocs);
        if (!product) return null;
        return {
          product,
          quantity: item.quantity || 1
        };
      })
      .filter(Boolean);

    await Cart.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        items,
        createdAt: parseDate(data.createdAt),
        updatedAt: parseDate(data.updatedAt)
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    upserted += 1;
  }

  return { upserted };
};

const migrateSubscriptions = async (firebaseSubscriptions, userIdMap, productIdMap) => {
  let upserted = 0;

  for (const doc of firebaseSubscriptions.docs) {
    const data = doc.data();
    const userId = userIdMap.get(data.user);
    const productId = productIdMap.get(data.product);
    if (!userId || !productId) continue;

    await Subscription.findOneAndUpdate(
      {
        user: userId,
        product: productId,
        frequency: data.frequency || "daily",
        preferredSlot: data.preferredSlot || ""
      },
      {
        user: userId,
        product: productId,
        quantity: data.quantity || 1,
        frequency: data.frequency || "daily",
        preferredSlot: data.preferredSlot || "",
        nextDeliveryDate: parseDate(data.nextDeliveryDate),
        active: data.active ?? true,
        createdAt: parseDate(data.createdAt),
        updatedAt: parseDate(data.updatedAt)
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    upserted += 1;
  }

  return { upserted };
};

const migrateOrders = async (firebaseOrders, userIdMap, productIdMap) => {
  let upserted = 0;

  for (const doc of firebaseOrders.docs) {
    const data = doc.data();
    const userId = userIdMap.get(data.user);
    if (!userId) continue;

    const orderNumber = data.orderNumber || migratedOrderNumber(doc.id) || generateOrderNumber();
    const items = (data.items || [])
      .map((item) => {
        const product = productIdMap.get(item.product);
        if (!product) return null;
        return {
          product,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          weight: item.weight
        };
      })
      .filter(Boolean);

    await Order.findOneAndUpdate(
      { orderNumber },
      {
        user: userId,
        orderNumber,
        items,
        address: data.address || {},
        paymentMethod: data.paymentMethod || "razorpay",
        paymentStatus: data.paymentStatus || "pending",
        status: data.status || "placed",
        timeline: (data.timeline || []).map((step) => ({
          ...step,
          timestamp: parseDate(step.timestamp)
        })),
        scheduledSlot: data.scheduledSlot || "",
        subtotal: data.subtotal || 0,
        deliveryFee: data.deliveryFee || 0,
        discount: data.discount || 0,
        loyaltyPointsEarned: data.loyaltyPointsEarned || 0,
        total: data.total || 0,
        createdAt: parseDate(data.createdAt),
        updatedAt: parseDate(data.updatedAt)
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    upserted += 1;
  }

  return { upserted };
};

const run = async () => {
  const firebaseDb = buildFirebaseDb();
  await connectDB();

  const snapshots = await Promise.all(firebaseCollections.map((name) => firebaseDb.collection(name).get()));
  const [firebaseUsers, firebaseProducts, firebaseCarts, firebaseOrders, firebaseSubscriptions] = snapshots;
  const firebaseProductDocs = new Map(firebaseProducts.docs.map((doc) => [doc.id, { id: doc.id, ...doc.data() }]));

  const productResult = await migrateProducts(firebaseProducts);
  const userResult = await migrateUsers(firebaseUsers);
  const cartResult = await migrateCarts(firebaseCarts, userResult.userIdMap, productResult.productIdMap, firebaseProductDocs);
  const subscriptionResult = await migrateSubscriptions(firebaseSubscriptions, userResult.userIdMap, productResult.productIdMap);
  const orderResult = await migrateOrders(firebaseOrders, userResult.userIdMap, productResult.productIdMap);

  console.log(
    JSON.stringify(
      {
        users: userResult.upserted,
        productsCreated: productResult.created,
        productsUpdated: productResult.updated,
        carts: cartResult.upserted,
        subscriptions: subscriptionResult.upserted,
        orders: orderResult.upserted
      },
      null,
      2
    )
  );

  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close().catch(() => {});
  process.exit(1);
});

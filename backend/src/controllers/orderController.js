import Razorpay from "razorpay";
import { Cart } from "../models/Cart.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { buildTrackingTimeline, getLiveTracking } from "../utils/orderTracking.js";
import { demoStore } from "../utils/demoStore.js";
import { firebaseStore } from "../utils/firestoreStore.js";
import { isFirebaseMode } from "../config/firebase.js";

const isDemoMode = () => process.env.DEMO_MODE === "true";

const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      })
    : null;

const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 499 ? 0 : 35;
  const discount = subtotal > 799 ? 50 : 0;
  const total = subtotal + deliveryFee - discount;

  return { subtotal, deliveryFee, discount, total };
};

export const createPaymentOrder = async (req, res) => {
  if (!razorpay) {
    return res.json({
      provider: "razorpay",
      mock: true,
      id: `mock_order_${Date.now()}`,
      amount: req.body.amount
    });
  }

  const order = await razorpay.orders.create({
    amount: req.body.amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`
  });

  res.json(order);
};

export const placeOrder = async (req, res) => {
  if (isFirebaseMode()) {
    const { addressId, paymentMethod, scheduledSlot } = req.body;
    const cart = await firebaseStore.getCart(req.user._id);
    const user = await firebaseStore.findUserById(req.user._id);

    if (!cart?.items?.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const address = (user.addresses || []).find((item) => item._id === addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ message: `${item.product.name} is out of stock` });
      }
    }

    const totals = calculateTotals(cart.items);
    const loyaltyPointsEarned = Math.floor(totals.total / 20);
    const order = await firebaseStore.createOrder({
      user: req.user._id,
      items: cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        quantity: item.quantity,
        weight: item.product.weight
      })),
      address,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      status: "placed",
      scheduledSlot,
      loyaltyPointsEarned,
      timeline: buildTrackingTimeline(new Date()),
      ...totals
    });

    const preferences = [...(user.purchasePreferences || [])];
    for (const item of cart.items) {
      const existing = preferences.find((pref) => pref.category === item.product.category);
      if (existing) {
        existing.score += item.quantity;
      } else {
        preferences.push({
          category: item.product.category,
          brand: item.product.brand,
          score: item.quantity
        });
      }
    }

    await firebaseStore.updateUser(req.user._id, {
      loyaltyPoints: (user.loyaltyPoints || 0) + loyaltyPointsEarned,
      purchasePreferences: preferences
    });
    await firebaseStore.saveCart(req.user._id, []);

    return res.status(201).json(order);
  }

  if (isDemoMode()) {
    return res.status(400).json({ message: "Demo mode checkout is not connected yet." });
  }

  const { addressId, paymentMethod, scheduledSlot } = req.body;
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  const user = await User.findById(req.user._id);

  if (!cart?.items?.length) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const address = user.addresses.id(addressId);
  if (!address) {
    return res.status(404).json({ message: "Address not found" });
  }

  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      return res.status(400).json({ message: `${item.product.name} is out of stock` });
    }
  }

  const totals = calculateTotals(cart.items);
  const loyaltyPointsEarned = Math.floor(totals.total / 20);
  const order = await Order.create({
    user: req.user._id,
    items: cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      quantity: item.quantity,
      weight: item.product.weight
    })),
    address: address.toObject(),
    paymentMethod,
    paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
    scheduledSlot,
    loyaltyPointsEarned,
    timeline: buildTrackingTimeline(new Date()),
    ...totals
  });

  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });

    const categoryPreference = user.purchasePreferences.find(
      (pref) => pref.category === item.product.category
    );
    if (categoryPreference) {
      categoryPreference.score += item.quantity;
    } else {
      user.purchasePreferences.push({
        category: item.product.category,
        brand: item.product.brand,
        score: item.quantity
      });
    }
  }

  user.loyaltyPoints += loyaltyPointsEarned;
  cart.items = [];

  await Promise.all([user.save(), cart.save()]);

  res.status(201).json(order);
};

export const getOrders = async (req, res) => {
  if (isFirebaseMode()) {
    return res.json(await firebaseStore.getOrders(req.user._id));
  }

  if (isDemoMode()) {
    return res.json(await demoStore.getOrders(req.user._id));
  }

  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

export const getOrderTracking = async (req, res) => {
  if (isFirebaseMode()) {
    const order = await firebaseStore.getOrderById(req.params.orderId);

    if (!order || order.user !== req.user._id) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json(getLiveTracking(order));
  }

  if (isDemoMode()) {
    return res.json({
      currentStatus: "placed",
      timeline: buildTrackingTimeline(new Date()).map((item, index) => ({
        ...item,
        completed: index === 0
      }))
    });
  }

  const order = await Order.findOne({ _id: req.params.orderId, user: req.user._id });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(getLiveTracking(order));
};

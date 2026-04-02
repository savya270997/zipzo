import { randomUUID } from "crypto";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { demoStore } from "../utils/demoStore.js";
import { catalogProducts } from "../utils/catalogData.js";
import { firebaseStore } from "../utils/firestoreStore.js";
import { isFirebaseMode } from "../config/firebase.js";

const isDemoMode = () => process.env.DEMO_MODE === "true";

const populateCart = (cartId) =>
  Cart.findById(cartId).populate("items.product");

export const getCart = async (req, res) => {
  if (isFirebaseMode()) {
    return res.json(await firebaseStore.getCart(req.user._id));
  }

  if (isDemoMode()) {
    return res.json(await demoStore.getCart(req.user._id));
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  res.json(cart);
};

export const addToCart = async (req, res) => {
  if (isFirebaseMode()) {
    const { productId, quantity = 1 } = req.body;
    const product = await firebaseStore.getProductById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cart = await firebaseStore.getCart(req.user._id);
    const existingItem = cart.items.find((item) => item.product._id === productId);
    const nextItems = existingItem
      ? cart.items.map((item) =>
          item.product._id === productId ? { ...item, quantity: item.quantity + quantity } : item
        )
      : [...cart.items, { _id: `cart-item-${randomUUID()}`, product, quantity }];

    return res.status(201).json(await firebaseStore.saveCart(req.user._id, nextItems));
  }

  if (isDemoMode()) {
    const { productId, quantity = 1 } = req.body;
    const product = catalogProducts.find((item) => item._id === productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cart = await demoStore.getCart(req.user._id);
    const existingItem = cart.items.find((item) => item.product._id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ _id: `demo-cart-item-${cart.items.length + 1}`, product, quantity });
    }

    return res.status(201).json(cart);
  }

  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const cart = await Cart.findOne({ user: req.user._id });
  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  res.status(201).json(await populateCart(cart._id));
};

export const updateCartItem = async (req, res) => {
  if (isFirebaseMode()) {
    const { quantity } = req.body;
    const cart = await firebaseStore.getCart(req.user._id);
    const item = cart.items.find((entry) => entry._id === req.params.itemId);

    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const nextItems =
      quantity <= 0
        ? cart.items.filter((entry) => entry._id !== req.params.itemId)
        : cart.items.map((entry) =>
            entry._id === req.params.itemId ? { ...entry, quantity } : entry
          );

    return res.json(await firebaseStore.saveCart(req.user._id, nextItems));
  }

  if (isDemoMode()) {
    const { quantity } = req.body;
    const cart = await demoStore.getCart(req.user._id);
    const item = cart.items.find((entry) => entry._id === req.params.itemId);

    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter((entry) => entry._id !== req.params.itemId);
    } else {
      item.quantity = quantity;
    }

    return res.json(cart);
  }

  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  const item = cart.items.id(req.params.itemId);

  if (!item) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  if (quantity <= 0) {
    item.deleteOne();
  } else {
    item.quantity = quantity;
  }

  await cart.save();
  res.json(await populateCart(cart._id));
};

export const removeCartItem = async (req, res) => {
  if (isFirebaseMode()) {
    const cart = await firebaseStore.getCart(req.user._id);
    const nextItems = cart.items.filter((item) => item._id !== req.params.itemId);
    return res.json(await firebaseStore.saveCart(req.user._id, nextItems));
  }

  if (isDemoMode()) {
    const cart = await demoStore.getCart(req.user._id);
    cart.items = cart.items.filter((item) => item._id !== req.params.itemId);
    return res.json(cart);
  }

  const cart = await Cart.findOne({ user: req.user._id });
  const item = cart.items.id(req.params.itemId);

  if (!item) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  item.deleteOne();
  await cart.save();
  res.json(await populateCart(cart._id));
};

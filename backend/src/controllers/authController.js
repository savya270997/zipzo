import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Cart } from "../models/Cart.js";
import { generateToken } from "../utils/generateToken.js";
import { demoStore } from "../utils/demoStore.js";
import { firebaseStore } from "../utils/firestoreStore.js";
import { isFirebaseMode } from "../config/firebase.js";

const isDemoMode = () => process.env.DEMO_MODE === "true";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  loyaltyPoints: user.loyaltyPoints,
  addresses: user.addresses
});

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const validatePassword = (password) =>
  /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && password.length >= 8;

export const signup = async (req, res) => {
  const { name, email, password, confirmPassword, role = "customer", address } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ message: "Name is required" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Please use a valid email address" });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ message: "Password must be 8+ chars with upper, lower, and a number" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  if (!address?.line1 || !address?.city || !address?.state || !address?.postalCode || !address?.fullName || !address?.phone) {
    return res.status(400).json({ message: "Address with full name, phone, line1, city, state, and postal code is required" });
  }

  if (!["customer", "seller"].includes(role)) {
    return res.status(400).json({ message: "Invalid account type" });
  }

  const addressPayload = {
    ...address,
    label: address.label || "Home",
    line2: address.line2 || "",
    landmark: address.landmark || "",
    isDefault: true
  };

  if (isDemoMode()) {
    const existingDemoUser = await demoStore.findUserByEmail(email);
    if (existingDemoUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await demoStore.createUser({ name, email, password: hashedPassword, role, addresses: [addressPayload] });

    return res.status(201).json({
      token: generateToken(user._id),
      user: sanitizeUser(user)
    });
  }

  if (isFirebaseMode()) {
    const existingUser = await firebaseStore.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await firebaseStore.createUser({ name, email, password: hashedPassword, role, addresses: [addressPayload] });

    return res.status(201).json({
      token: generateToken(user._id),
      user: sanitizeUser(user)
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, role, addresses: [addressPayload] });
  await Cart.create({ user: user._id, items: [] });

  res.status(201).json({
    token: generateToken(user._id),
    user: sanitizeUser(user)
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (isDemoMode()) {
    const user = await demoStore.findUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    return res.json({
      token: generateToken(user._id),
      user: sanitizeUser(user)
    });
  }

  if (isFirebaseMode()) {
    const user = await firebaseStore.findUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    return res.json({
      token: generateToken(user._id),
      user: sanitizeUser(user)
    });
  }

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({
    token: generateToken(user._id),
    user: sanitizeUser(user)
  });
};

export const me = async (req, res) => {
  res.json(req.user);
};

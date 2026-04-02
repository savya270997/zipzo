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
  loyaltyPoints: user.loyaltyPoints,
  addresses: user.addresses
});

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (isDemoMode()) {
    const existingDemoUser = await demoStore.findUserByEmail(email);
    if (existingDemoUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await demoStore.createUser({ name, email, password: hashedPassword });

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
    const user = await firebaseStore.createUser({ name, email, password: hashedPassword });

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
  const user = await User.create({ name, email, password: hashedPassword });
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

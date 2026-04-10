import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { demoStore } from "../utils/demoStore.js";
import { firebaseStore } from "../utils/firestoreStore.js";
import { isFirebaseMode } from "../config/firebase.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user =
      process.env.DEMO_MODE === "true"
        ? await demoStore.findUserById(decoded.id)
        : isFirebaseMode()
          ? await firebaseStore.findUserById(decoded.id)
        : await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (req.user.accountStatus === "suspended") {
      return res.status(403).json({ message: "This account has been suspended. Contact support." });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "You do not have access to this area" });
  }

  next();
};

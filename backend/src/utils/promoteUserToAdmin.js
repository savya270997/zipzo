import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env") });

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.error("Usage: node src/utils/promoteUserToAdmin.js <email>");
  process.exit(1);
}

try {
  await connectDB();
  const user = await User.findOneAndUpdate(
    { email },
    { role: "admin" },
    { new: true }
  ).select("_id name email role");

  if (!user) {
    console.error(`No user found for ${email}`);
    process.exit(1);
  }

  console.log(`Promoted ${user.email} to admin (${user._id})`);
  await mongoose.disconnect();
} catch (error) {
  console.error("Unable to promote user to admin", error);
  process.exit(1);
}

import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Product } from "../models/Product.js";
import { catalogProducts, categoryCount } from "./catalogData.js";
import { firebaseStore } from "./firestoreStore.js";
import { initFirebase, isFirebaseMode } from "../config/firebase.js";

dotenv.config();

const run = async () => {
  if (isFirebaseMode()) {
    initFirebase();
    await firebaseStore.seedProducts(catalogProducts);
    console.log(`Seeded ${catalogProducts.length} products across ${categoryCount} categories to Firestore`);
    return;
  }

  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(catalogProducts.map(({ _id, ...product }) => product));
  console.log(`Seeded ${catalogProducts.length} products across ${categoryCount} categories`);
  await mongoose.connection.close();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

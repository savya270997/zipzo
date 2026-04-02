import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initFirebase, isFirebaseMode } from "./config/firebase.js";

dotenv.config();

const port = process.env.PORT || 5000;
const isDemoMode = process.env.DEMO_MODE === "true";

const startServer = async () => {
  try {
    if (isFirebaseMode()) {
      initFirebase();
      console.log("Running with Firebase Firestore");
    } else if (!isDemoMode) {
      await connectDB();
    } else {
      console.log("Running in demo mode without MongoDB");
    }

    app.listen(port, () => {
      console.log(`API running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();

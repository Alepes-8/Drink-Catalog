import mongoose from "mongoose";
import { getMongoURI } from "../config/config.js";

export const connectDB = async () => {
    const MONGO_URI = getMongoURI();

    if (!MONGO_URI) {
        console.warn("⚠️ MONGO_URI missing, falling back to localhost");
    }

    const uri = MONGO_URI || "mongodb://localhost:27017/drink";

    mongoose.set("strictQuery", true);

    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");

    return mongoose.connection;
};

export const disconnectDB = async () => {
    await mongoose.disconnect();
};

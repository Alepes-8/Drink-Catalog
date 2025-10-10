import dotenv from "dotenv";
dotenv.config(); // Load variables from .env

// Ensure there's always a valid Mongo URI
export const MONGO_URI =
  !process.env.MONGO_URI ||
  process.env.MONGO_URI.includes("localhost") ||
  process.env.MONGO_URI.includes("127.0.0.1")
    ? "mongodb://mongo:27017/drink"
    : process.env.MONGO_URI;

export const PORT = process.env.PORT || 5001;

console.log(`📡 Using Mongo URI: ${MONGO_URI}`);
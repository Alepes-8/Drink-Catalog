import dotenv from "dotenv";
dotenv.config(); // Load variables from .env

// Ensure there's always a valid Mongo URI
export let MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  if (process.env.NODE_ENV === "production") {
    console.error("❌ MONGO_URI is not defined. Set it in Render environment variables!");
    process.exit(1); // Fail fast
  } else {
    console.warn("⚠️ MONGO_URI not defined, falling back to localhost for development");
     MONGO_URI = "mongodb://localhost:27017/drinksssssssssssssss";
  }
}

export const PORT = process.env.PORT || 5001;

console.log(`📡 Using Mongo URI: ${MONGO_URI}`);
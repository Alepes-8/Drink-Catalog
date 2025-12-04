import dotenv from "dotenv";
dotenv.config(); // Load .env

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || 5001;

export function getMongoURI() {
    let uri = process.env.MONGO_URI;

    if (!uri) {
        if (NODE_ENV === "production") {
            console.error("❌ MONGO_URI is not defined. Set it in Render environment variables!");
            process.exit(1);
        } else {
            console.warn("⚠️ MONGO_URI not defined, falling back to localhost for development");
            uri = "mongodb://localhost:27017/drink";
        }
    }

    return uri;
}

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

import { PORT } from "./config/config.js";
import { connectDB } from "./db/index.js";
import routes from "./routes/routes.js";
import { populateDatabase } from "./populateDatabase.js"; 
import { seedAdmin } from "./authentication/seedAdmin.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---------- Swagger ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerPath = path.resolve(__dirname, "../swagger/src/routes/openapi.yaml");
const swaggerDocument = YAML.load(swaggerPath);

import { swaggerUi, swaggerSpec } from "../swagger/swaggerConfig.js";

if (process.env.NODE_ENV === "production") {
    app.use("/api-docs", swaggerUi.serve, (req, res, next) => {
        const host = req.get("host");
        const protocol = req.protocol;

        return swaggerUi.setup({
            ...swaggerDocument,
            servers: [{ url: `${protocol}://${host}/drink` }]
        })(req, res, next);
    });
} else {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

console.log("📘 Swagger docs available at: http://localhost:5001/api-docs");

// ----------------- Routes -----------------
app.get("/", (req, res) => {
  res.send("Drink API is running...");
});

app.use("/drink", routes);

// ---------- Connect to DB & Start Server ----------
if (process.env.NODE_ENV !== "test") {
    console.log("🔌 Connecting to MongoDB...");

    connectDB()
        .then(async () => {
            await seedAdmin();
            await populateDatabase();

            app.listen(PORT, () => {
                console.log(`🚀 Server running on port ${PORT}`);
            });
        })
        .catch(err => {
            console.error("❌ DB connection failed:", err);
            process.exit(1);
        });
}

export default app;

// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { swaggerUi, swaggerSpec } from "../swagger/swaggerConfig.js";
import YAML from "yamljs";
import { MONGO_URI, PORT } from './config/config.js';

import routes from "./routes/routes.js"
import DrinkRecipe from "./models/drinkRecipe.js";
import Ingredients from "./models/ingredients.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const filePath = path.resolve(dirname, "./config/testData/drinks_start_A.json");
export const START_DATA = JSON.parse(fs.readFileSync(filePath, "utf-8"));

//Create application and set it to use jsonb and movie routes.
dotenv.config();

const app = express();

// ----------------- Middleware -----------------
app.use(cors());
app.use(express.json());    //Without this, the body will be undefined


// ----------------- Setup swagger ui -----------------
// This runs on http://localhost:5001/api-docs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerPath = path.resolve(__dirname, "../swagger/src/routes/openapi.yaml");
const swaggerDocument = YAML.load(swaggerPath);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
console.log("📘 Swagger docs available at: http://localhost:5001/api-docs");

// ----------------- Routes -----------------
app.get("/", (req, res) => {
  res.send("Drink API is running...");
});

app.use("/drink", routes);

// ----------------- MongoDB Connection -----------------
// Only connect to Mongo if not in test 
if (process.env.NODE_ENV !== "test") {
  console.log("🔌 Connecting to MongoDB... ---- " , MONGO_URI);
  if (!MONGO_URI) {
    console.error("❌ MONGO_URI is not defined");
    process.exit(1);
  }

  mongoose
    .connect(MONGO_URI)
    .then(async () =>{
      console.log("✅ MongoDB connected")
      
      // Seed admin after connection
      const { seedAdmin } = await import("./authentication/seedAdmin.js");
      await seedAdmin();
     })
    .catch(err => console.error("❌ MongoDB connection error:", err));

  populateDatabase();

  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} \n Address ${MONGO_URI}`));
} else {
  // Test environment: seed roles automatically
  mongoose.connect(MONGO_URI).then(async () => {
    const { seedAdmin } = await import("./authentication/seedAdmin.js");
    await seedAdmin();
  });
}

async function populateDatabase(){

    // 1. Clear DrinkRecipe table
    await DrinkRecipe.deleteMany();

    // 2. Parse all drinks into simple objects
    const everyDrink = START_DATA.DATA.map(drink => {
        const ingredients = [];

        for (let i = 1; i <= 15; i++) {
            const ing = drink[`strIngredient${i}`];
            if (ing) ingredients.push(ing.trim().toLowerCase());
        }

        return {
            name: drink.strDrink.trim().toLowerCase(),
            ingredientNames: ingredients,
        };
    });

    // 3. Collect unique ingredient names
    const uniqueIngredientNames = [
        ...new Set(everyDrink.flatMap(d => d.ingredientNames))
    ];

    // 4. Upsert ingredients
    const ingredientOps = uniqueIngredientNames.map(name => ({
        updateOne: {
            filter: { name },
            update: { $setOnInsert: { name } },
            upsert: true
        }
    }));

    await Ingredients.bulkWrite(ingredientOps);

    // 5. Fetch ingredient IDs
    const ingredientDocs = await Ingredients.find({
        name: { $in: uniqueIngredientNames }
    });

    const ingredientMap = Object.fromEntries(
        ingredientDocs.map(doc => [doc.name, doc._id])  // Set name so that it can be found in step 6
    );

    // 6. Build drink bulk ops
    const drinkOps = everyDrink.map(drink => ({
        updateOne: {
            filter: { name: drink.name },
            update: {
                $setOnInsert: {
                    name: drink.name,
                    ingredients: drink.ingredientNames.map(name => ingredientMap[name])
                }
            },
            upsert: true
        }
    }));

    await DrinkRecipe.bulkWrite(drinkOps);

    DrinkRecipe.create({
        name: "test drink",
        ingredientNames: ["test whisky", "test sockerlag", "test angostura bitters"]
    });
};

// ----------------- Export app for testing -----------------
export default app 
export { populateDatabase };
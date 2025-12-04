import DrinkRecipe from "./models/drinkRecipe.js";
import Ingredients from "./models/ingredients.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const filePath = path.resolve(dirname, "./config/testData/drinks_start_A.json");
export const START_DATA = JSON.parse(fs.readFileSync(filePath, "utf-8"));

export async function populateDatabase() {
    await DrinkRecipe.deleteMany();

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

    const uniqueIngredientNames = [
        ...new Set(everyDrink.flatMap(d => d.ingredientNames))
    ];

    const ingredientOps = uniqueIngredientNames.map(name => ({
        updateOne: {
            filter: { name },
            update: { $setOnInsert: { name } },
            upsert: true
        }
    }));

    await Ingredients.bulkWrite(ingredientOps);

    const ingredientDocs = await Ingredients.find({ name: { $in: uniqueIngredientNames } });

    const ingredientMap = Object.fromEntries(
        ingredientDocs.map(doc => [doc.name, doc._id])
    );

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
}

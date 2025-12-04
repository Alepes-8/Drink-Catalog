import request from "supertest";
import app from "../../src/app.js";
import { STATUS_CODES } from "../../src/config/constants.js";
import mockingoose from "mockingoose";
import DrinkRecipe from "../../src/models/drinkRecipe.js";
import Ingredients from "../../src/models/ingredients.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const filePath = path.resolve(dirname, "../../src/config/testData/drinks_start_A.json");
export const START_DATA = JSON.parse(fs.readFileSync(filePath, "utf-8"));

import { beforeEach, jest } from "@jest/globals";

describe("Drink API Integration Tests", () => {
    beforeEach(() => {
        jest.resetModules(); // Clear the module cache
    })

    it("should delete all existing drinks and upsert ingredients and drinks", async () => {
        // Mock deleteMany
        mockingoose(DrinkRecipe).toReturn({}, "deleteMany");

        // Mock Ingredients.bulkWrite and find
        const mockIngredientsDocs = START_DATA.DATA.slice(0, 3) // take first 3 for brevity
        .flatMap(drink => {
            return Array.from({ length: 3 }, (_, i) => ({
            _id: `ingredientId${i}`,
            name: `ingredient${i}`,
            }));
        });

        const mockResult = { acknowledged: true, modifiedCount: 1 };
        jest.spyOn(Ingredients, 'bulkWrite').mockResolvedValue(mockResult);
        mockingoose(Ingredients).toReturn(mockIngredientsDocs, "find");

        const mockResul2 = { acknowledged: true, modifiedCount: 1 };
        jest.spyOn(DrinkRecipe, 'bulkWrite').mockResolvedValue(mockResul2);
        mockingoose(DrinkRecipe).toReturn({}, "create");

        jest.spyOn(DrinkRecipe, "deleteMany").mockResolvedValue();
        jest.spyOn(DrinkRecipe, "create").mockResolvedValue();

        // Act
        const { populateDatabase } = await import("../../src/populateDatabase.js");
        await populateDatabase();

        // Assert deleteMany was called
        expect(DrinkRecipe.deleteMany).toHaveBeenCalled();
        expect(Ingredients.bulkWrite).toHaveBeenCalled();
        expect(DrinkRecipe.bulkWrite).toHaveBeenCalled();
        
        expect(DrinkRecipe.create).toHaveBeenCalledWith({
            name: "test drink",
            ingredientNames: ["test whisky", "test sockerlag", "test angostura bitters"]
        });
    });
});

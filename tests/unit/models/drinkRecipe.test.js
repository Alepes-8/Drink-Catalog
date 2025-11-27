import mockingoose from "mockingoose";
import DrinkRecipe from "../../../src/models/drinkRecipe.js";
import Ingredients from "../../../src/models/ingredients.js";
import { spyOn} from 'jest-mock';
import mongoose from "mongoose";

describe("Drink Model Unit Tests", () => {
    beforeEach(() => mockingoose.resetAll());

    it("should save drink and convert ingredientNames into ObjectId references", async () => {
        // arrange
        const ingredientId1 =  new mongoose.Types.ObjectId();
        const ingredientId2 =  new mongoose.Types.ObjectId();

        const ingredientDocs = [
            { _id: ingredientId1, name: "vodka" },
            { _id: ingredientId2, name: "lime" }
        ];
        const drinkData = {
            name: "vodka lime",
            ingredientNames: ["Vodka", "Lime"]
        };
        const drink = new DrinkRecipe(drinkData);

        // Mock bulkWrite + find
        const mockResult = { acknowledged: true, modifiedCount: 1 };
        spyOn(Ingredients, 'bulkWrite').mockResolvedValue(mockResult);
        mockingoose(Ingredients).toReturn(ingredientDocs, "find");
        mockingoose(DrinkRecipe).toReturn(drinkData, "save");

        //act
        const response = await drink.save();

        //assert
        expect(response.name).toBe("vodka lime");
        expect(response.ingredientNames).toEqual(["Vodka", "Lime"]);
    });
});

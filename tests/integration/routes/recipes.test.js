import mockingoose from "mockingoose";
import request from "supertest";
import mongoose from "mongoose";

import app from "../../../src/app.js";
import DrinkRecipe from "../../../src/models/drinkRecipe.js";
import Ingredients from "../../../src/models/ingredients.js";
import Notes from "../../../src/models/notes.js";
import Ratings from "../../../src/models/ratings.js";

import { STATUS_CODES, STATUS_MESSAGES } from "../../../src/config/constants.js";
import { fn } from "jest-mock";

describe("Drink API Integration Tests", () => {
    beforeEach(() => {
        mockingoose.resetAll();
    });

    /* ---------------------------------------------------
     * GET /health
     * --------------------------------------------------- */
    it("GET /health should return service status", async () => {
        const res = await request(app).get("/drink/health");
        expect(res.statusCode).toBe(STATUS_CODES.SUCCESS);
        expect(res.body.apiCalled).toBe("ok");
    });
    
    /* ---------------------------------------------------
     * GET /searchByName
     * --------------------------------------------------- */
    it("GET /searchByName should return drinks matching name", async () => {
        const drinkId = new mongoose.Types.ObjectId();
        const ingredientId = new mongoose.Types.ObjectId();

        const mockDrinks = [
            {
                _id: drinkId,
                name: "margarita",
                ingredients: [ingredientId]
            }
        ];

        const mockIngredients = [
            { _id: ingredientId, name: "lime" }
        ];

        mockingoose(DrinkRecipe).toReturn(mockDrinks, "find");
        mockingoose(Ingredients).toReturn(mockIngredients, "find");

        const token = "mocktoken"; // auth middleware must accept this or be mocked

        const res = await request(app)
            .get("/drink/searchByName?drinkName=mar")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(STATUS_CODES.SUCCESS);
        expect(res.body.length).toBe(1);
        expect(res.body[0].name).toBe("margarita");
    });

    
    /* ---------------------------------------------------
     * GET /searchByIngredients
     * --------------------------------------------------- */
    it("GET /searchByIngredients should search using ingredient names", async () => {

        const ingredientId = new mongoose.Types.ObjectId();
        const drinkId = new mongoose.Types.ObjectId();

        const mockIngredients = [{ _id: ingredientId, name: "vodka" }];
        const mockDrinks = [{
            _id: drinkId,
            name: "vodka tonic",
            ingredients: [ingredientId]
        }];

        mockingoose(Ingredients).toReturn(mockIngredients, "find");
        mockingoose(DrinkRecipe).toReturn(mockDrinks, "find");

        const token = "mocktoken";

        const res = await request(app)
            .get("/drink/searchByIngredients")
            .set("Authorization", `Bearer ${token}`)
            .send({ ingredients: ["vodka"] });

        expect(res.statusCode).toBe(STATUS_CODES.SUCCESS);
        expect(res.body.result.length).toBe(1);
        expect(res.body.result[0].name).toBe("vodka tonic");
    });

    /* ---------------------------------------------------
     * GET /getDrinkById
     * --------------------------------------------------- */
    it("GET /getDrinkById should return drink info including notes + rating", async () => {

        const drinkId = new mongoose.Types.ObjectId();
        const ingredientId = new mongoose.Types.ObjectId();
        const userId = new mongoose.Types.ObjectId();

        const mockDrink = [{
            _id: drinkId,
            name: "old fashioned",
            ingredients: [ingredientId]
        }];

        const mockIngredient = [{
            _id: ingredientId,
            name: "whiskey"
        }];

        const mockNotes = {
            drinkID: drinkId,
            userId: userId,
            notes: "good drink"
        };

        const mockRating = {
            drinkID: drinkId,
            userId: userId,
            rating: 9
        };

        mockingoose(DrinkRecipe).toReturn(mockDrink, "find");
        mockingoose(Ingredients).toReturn(mockIngredient, "find");
        mockingoose(Notes).toReturn(mockNotes, "findOne");
        mockingoose(Ratings).toReturn(mockRating, "findOne");

        // Mock user in auth middleware
        const token = "mocktoken";
        
        const res = await request(app)
            .get(`/drink/getDrinkById?drinkId=${drinkId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(STATUS_CODES.SUCCESS);
        expect(res.body.returnValue.drinkData[0].name).toBe("old fashioned");
        expect(res.body.returnValue.notes.notes).toBe("good drink");
        expect(res.body.returnValue.userRating.rating).toBe(9);
    });

    /* ---------------------------------------------------
     * PUT /updateDrinkNote
     * --------------------------------------------------- */
    it("PUT /updateDrinkNote should update user's note", async () => {
        const drinkId = new mongoose.Types.ObjectId();
        const userId = new mongoose.Types.ObjectId();

        const updated = { drinkID: drinkId, userId: userId, notes: "great drink" };

        mockingoose(Notes).toReturn(updated, "findOneAndUpdate");

        const token = "mocktoken";

        const res = await request(app)
            .put(`/drink/updateDrinkNote?drinkId=${drinkId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ notes: "great drink" });

        expect(res.statusCode).toBe(STATUS_CODES.UPDATE_SUCCESS);
        expect(res.body.message).toBe(STATUS_MESSAGES.SUCCESS_NOTE_UPDATE);
    });

    /* ---------------------------------------------------
     * PUT /updateDrinkRating
     * --------------------------------------------------- */
    it("PUT /updateDrinkRating should update user's rating", async () => {
        const drinkId = new mongoose.Types.ObjectId();
        const userId = new mongoose.Types.ObjectId();

        const updatedRating = {
            drinkID: drinkId,
            userId: userId,
            rating: 8
        };

        mockingoose(Ratings).toReturn(updatedRating, "findOneAndUpdate");

        const token = "mocktoken";

        const res = await request(app)
            .put(`/drink/updateDrinkRating?drinkId=${drinkId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ rating: 8 });

        expect(res.statusCode).toBe(STATUS_CODES.UPDATE_SUCCESS);
        expect(res.body.message).toBe(STATUS_MESSAGES.SUCCESS_RATING_UPDATE);
    });
});

import mockingoose from "mockingoose";
import Ratings from "../../../src/models/ratings.js";
import mongoose from "mongoose";

describe("Ratings Model Unit Tests", () => {
    beforeEach(() => mockingoose.resetAll());

    it("should create a rating", async () => {
        const drinkId = new mongoose.Types.ObjectId();
        const userId = new mongoose.Types.ObjectId();

        const ratingData = {
            drinkID: drinkId,
            userId: userId,
            rating: 8
        };

        mockingoose(Ratings).toReturn(ratingData, "save");

        const rating = new Ratings(ratingData);
        const saved = await rating.save();

        expect(saved.rating).toBe(8);
    });
});

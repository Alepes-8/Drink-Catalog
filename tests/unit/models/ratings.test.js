import mockingoose from "mockingoose";
import Ratings from "../../../src/models/ratings.js";
import mongoose from "mongoose";

describe("Ratings Model Unit Tests", () => {
    beforeEach(() => mockingoose.resetAll());

    it("should create a rating", async () => {
        //Arrange
        const drinkId = new mongoose.Types.ObjectId();
        const userId = new mongoose.Types.ObjectId();
        const ratingData = {
            drinkID: drinkId,
            userId: userId,
            rating: 8
        };
        const rating = new Ratings(ratingData);

        mockingoose(Ratings).toReturn(ratingData, "save");

        // Act
        const saved = await rating.save();

        // Arrange
        expect(saved.rating).toBe(8);
    });
});

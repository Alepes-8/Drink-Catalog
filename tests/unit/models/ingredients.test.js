import mockingoose from "mockingoose";
import Ingredients from "../../../src/models/ingredients.js";

describe("Ingredients Model Unit Tests", () => {
    beforeEach(() => mockingoose.resetAll());

    it("should create an ingredient", async () => {
        const ingData = { name: "tequila" };

        mockingoose(Ingredients).toReturn(ingData, "save");

        const ing = new Ingredients(ingData);
        const saved = await ing.save();

        expect(saved.name).toBe("tequila");
    });
});

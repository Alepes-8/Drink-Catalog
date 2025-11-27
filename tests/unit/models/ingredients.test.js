import mockingoose from "mockingoose";
import Ingredients from "../../../src/models/ingredients.js";

describe("Ingredients Model Unit Tests", () => {
    beforeEach(() => mockingoose.resetAll());

    it("should create an ingredient", async () => {
        //Arrange
        const ingData = { name: "tequila" };
        const ingredient = new Ingredients(ingData);

        mockingoose(Ingredients).toReturn(ingData, "save");

        //Act
        const saved = await ingredient.save();

        //Assert
        expect(saved.name).toBe("tequila");
    });
});

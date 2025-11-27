import mockingoose from "mockingoose";
import Notes from "../../../src/models/notes.js";

describe("Notes Model Unit Tests", () => {
    beforeEach(() => mockingoose.resetAll());

    it("should create a note", async () => {
        // Arrange
        const noteData = {
            drinkID: "111111111111111111111111",
            userId: "222222222222222222222222",
            notes: "Great drink!"
        };
        const note = new Notes(noteData);

        mockingoose(Notes).toReturn(noteData, "save");

        // Act
        const saved = await note.save();

        // Assert
        expect(saved.notes).toBe("Great drink!");
    });
});

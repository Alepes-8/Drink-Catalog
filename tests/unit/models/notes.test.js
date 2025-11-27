import mockingoose from "mockingoose";
import Notes from "../../../src/models/notes.js";

describe("Notes Model Unit Tests", () => {
    beforeEach(() => mockingoose.resetAll());

    it("should create a note", async () => {
        const noteData = {
            drinkID: "111111111111111111111111",
            userId: "222222222222222222222222",
            notes: "Great drink!"
        };

        mockingoose(Notes).toReturn(noteData, "save");

        const note = new Notes(noteData);
        const saved = await note.save();

        expect(saved.notes).toBe("Great drink!");
    });
});

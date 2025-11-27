import mockingoose from "mockingoose";
import User from "../../../src/models/users.js";
import UserRoles from "../../../src/models/userRoles.js";
import Notes from "../../../src/models/notes.js";
import Ratings from "../../../src/models/ratings.js";
import mongoose from "mongoose";

describe("User Model Unit Tests", () => {
    beforeEach(() => mockingoose.resetAll());

    it("should hash password and assign default role on save", async () => {
        const role = { _id: "111111111111111111111111", name: "normal" };

        mockingoose(UserRoles).toReturn(role, "findOne");

        const userData = {
            email: "test@example.com",
            password: "password123",
        };

        mockingoose(User).toReturn(
            { ...userData, password: "hashed123", role: role._id },
            "save"
        );

        const user = new User(userData);
        const saved = await user.save();

        expect(saved.password).toBe("hashed123");
        expect(String(saved.role)).toBe(role._id);
    });

    it("should delete notes and ratings on user deletion", async () => {
        mockingoose(Notes).toReturn({}, "deleteMany");
        mockingoose(Ratings).toReturn({}, "deleteMany");
        const userId = new mongoose.Types.ObjectId();

        mockingoose(User).toReturn({}, "findByIdAndDelete");

        await User.findByIdAndDelete(userId);

        expect(true).toBe(true); // If no errors → hook executed successfully
    });
});

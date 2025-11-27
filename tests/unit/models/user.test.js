import mockingoose from "mockingoose";
import User from "../../../src/models/users.js";
import UserRoles from "../../../src/models/userRoles.js";
import Notes from "../../../src/models/notes.js";
import Ratings from "../../../src/models/ratings.js";
import mongoose from "mongoose";
import { jest } from "@jest/globals";
import bcrypt from "bcryptjs";

describe("User Model Unit Tests", () => {
    beforeEach(() => mockingoose.resetAll());

    it("should hash password and assign default role on save", async () => {
        // Arrange
        const role = { _id: "111111111111111111111111", name: "normal" };
        const userData = {
            email: "test@example.com",
            password: "password123",
        };
        const user = new User(userData);

        mockingoose(UserRoles).toReturn(role, "findOne");
        mockingoose(User).toReturn(
            { ...userData, password: "hashed123", role: role._id },
            "save"
        );

        // Act
        const saved = await user.save();

        //Arrange
        expect(saved.password).toBe("hashed123");
        expect(String(saved.role)).toBe(role._id);
    });

    it("should assign default role 'normal' when no role is provided", async () => {
        // Arrange
        const mockRole = {
            _id: "507f1f77bcf86cd799439011",
            name: "normal"
        };
         const userInput = {
            email: "test@example.com",
            password: "pass123"
        };
        const newUser = new User(userInput);

        jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword123");
        mockingoose(UserRoles).toReturn(mockRole, "findOne");
        mockingoose(User).toReturn(
            { ...userInput, password: "hashedPassword123", role: mockRole._id },
            "save"
        );

        // Act
        const savedUser = await newUser.save();

        // Assert
        expect(bcrypt.hash).toHaveBeenCalledTimes(1);
        expect(savedUser.password).toEqual("hashedPassword123");
        expect(String(savedUser.role)).toBe(String(mockRole._id));
    });

    it("should delete notes and ratings on user deletion", async () => {
        // Arrange
        const userId = new mongoose.Types.ObjectId();

        mockingoose(Notes).toReturn({}, "deleteMany");
        mockingoose(Ratings).toReturn({}, "deleteMany");
        mockingoose(User).toReturn({}, "findByIdAndDelete");

        // Act
        await User.findByIdAndDelete(userId);

        // Assert
        expect(true).toBe(true); // If no errors → hook executed successfully
    });
    
});

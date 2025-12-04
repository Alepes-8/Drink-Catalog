import mockingoose from "mockingoose";
import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import app from "../../../src/app.js";
import User from "../../../src/models/users.js";
import UserRoles from "../../../src/models/userRoles.js";
import { STATUS_CODES } from "../../../src/config/constants.js";
import { jest } from "@jest/globals";

describe("Authentication Controller Tests (DI version)", () => {
    let compareSpy;
    let signSpy;

    beforeEach(() => {
        mockingoose.resetAll();
        jest.restoreAllMocks(); // restore all previous spies/mocks

        // Spy on bcrypt.compare
        compareSpy = jest.spyOn(bcrypt, "compare");
        // Spy on jwt.sign
        signSpy = jest.spyOn(jwt, "sign");
    });

    it("POST /register should register a user", async () => {
        // Arrange
        mockingoose(User).toReturn({}, "create");

        // Act
        const res = await request(app)
            .post("/drink/register")
            .send({ email: "USER@example.com", password: "Password123" });

        // Assert
        expect(res.statusCode).toBe(STATUS_CODES.CREATION_SUCCESS);
        expect(res.body.message).toBe("User registered");
    });

    it("should return token on valid login", async () => {
        const roleId = new mongoose.Types.ObjectId();
        const userId = new mongoose.Types.ObjectId();

        const mockUser = { _id: userId, email: "test@example.com", password: "hashed-pass", role: roleId };
        const mockRole = { _id: roleId, name: "normal" };

        mockingoose(User).toReturn(mockUser, "findOne");
        mockingoose(UserRoles).toReturn(mockRole, "findOne");

        jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
        jest.spyOn(jwt, "sign").mockReturnValue("mock-jwt-token");

        const res = await request(app)
            .post("/drink/login")
            .send({ email: "test@example.com", password: "secret" });

        expect(res.statusCode).toBe(STATUS_CODES.SUCCESS);
        expect(res.body.token).toBe("mock-jwt-token");
    });

    /* ---------------------------------------------------
     * POST /login INVALID CREDENTIALS
     * --------------------------------------------------- */
    it("POST /login should return 400 on invalid credentials", async () => {
        // Arrange
        const mockUser = {
            email: "test@example.com",
            password: "hashedpassword"
        };

        mockingoose(User).toReturn({mockUser}, "findOne");

        jest.spyOn(bcrypt, "compare").mockResolvedValue(false);
        jest.spyOn(jwt, "sign").mockReturnValue("mock-jwt-token");

        // Act
        const res = await request(app)
            .post("/drink/login")
            .send({
                email: "test@example.com",
                password: "wrong"
            });

        // Assert
        expect(res.statusCode).toBe(STATUS_CODES.INVALID_INPUT);
        expect(res.body.error).toBe("Invalid credentials");
    });

    /* ---------------------------------------------------
     * DELETE /deleteUser (requires mocked auth)
     * --------------------------------------------------- */
    it("DELETE /deleteUser should delete current user", async () => {
        // Arrange
        mockingoose(User).toReturn({}, "findByIdAndDelete");

        // Act
        const res = await request(app)
            .delete("/drink/deleteUser")
            .set("Authorization", "Bearer mocktoken");

        // Assert
        expect(res.statusCode).toBe(STATUS_CODES.SUCCESS);
        expect(res.body.message).toBe("User deleted");
    });

    /* ---------------------------------------------------
     * DELETE /deleteUserByID (requires admin role)
     * --------------------------------------------------- */
    it("DELETE /deleteUserByID should delete a user when authorized as admin", async () => {
        // Arrange
        const deleteId = new mongoose.Types.ObjectId();

        mockingoose(User).toReturn({}, "findByIdAndDelete");

        // Act
        const res = await request(app)
            .delete("/drink/deleteUserByID")
            .set("Authorization", "Bearer mocktoken")
            .send({ id: deleteId });

        // Assert
        expect(res.statusCode).toBe(STATUS_CODES.SUCCESS);
        expect(res.body.message).toBe("User deleted");
    });

    /* ---------------------------------------------------
     * POST /getUserId
     * --------------------------------------------------- */
    it("POST /getUserId should return user's ID", async () => {
        //Arrange
        const userId = new mongoose.Types.ObjectId();

        const mockUser = {
            _id: userId,
            email: "person@example.com"
        };

        mockingoose(User).toReturn(mockUser, "findOne");

        //Act
        const res = await request(app)
            .get("/drink/getUserId")
            .set("Authorization", "Bearer mocktoken")
            .send({ email: "person@example.com" });

        // Assert
        expect(res.statusCode).toBe(STATUS_CODES.SUCCESS);
        expect(res.body.usersEmail).toBe("person@example.com");
        expect(res.body.usersId).toBe(String(userId));
    });
});

import mockingoose from "mockingoose";
import request from "supertest";
import mongoose from "mongoose";

import app from "../../../src/app.js";
import User from "../../../src/models/users.js";
import UserRoles from "../../../src/models/userRoles.js";
import { STATUS_CODES } from "../../../src/config/constants.js";
import { jest } from "@jest/globals";

describe("Authentication Controller Tests (DI version)", () => {
    const bcryptMock = { compare: jest.fn() };
    const jwtMock = { sign: jest.fn() };

    beforeEach(() => {
    mockingoose.resetAll();
    jest.clearAllMocks();
    });

    it("POST /register should register a user", async () => {
        mockingoose(User).toReturn({}, "create");

        const res = await request(app)
            .post("/drink/register")
            .send({ email: "USER@example.com", password: "Password123" });

        expect(res.statusCode).toBe(STATUS_CODES.CREATION_SUCCESS);
        expect(res.body.message).toBe("User registered");
    });

    it("POST /login should return token on valid login", async () => {
        const userId = new mongoose.Types.ObjectId();
        const roleId = new mongoose.Types.ObjectId();

        const mockUser = { _id: userId, email: "test@example.com", password: "hashed-pass", role: roleId };
        const mockRole = { _id: roleId, name: "user" };

        mockingoose(User).toReturn(mockUser, "findOne");
        mockingoose(UserRoles).toReturn(mockRole, "findById");

        bcryptMock.compare.mockResolvedValue(true);     //TODO fails
        jwtMock.sign.mockReturnValue("mock-jwt-token");

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
        const mockUser = {
            email: "test@example.com",
            password: "hashedpassword"
        };

        mockingoose(User).toReturn(mockUser, "findOne");
        bcryptMock.compare.mockResolvedValue(true);     //TODO fails

        const res = await request(app)
            .get("/drink/login")
            .send({
                email: "test@example.com",
                password: "wrong"
            });

        expect(res.statusCode).toBe(STATUS_CODES.INVALID_INPUT);
        expect(res.body.error).toBe("Invalid credentials");
    });

    /* ---------------------------------------------------
     * DELETE /deleteUser (requires mocked auth)
     * --------------------------------------------------- */
    it("DELETE /deleteUser should delete current user", async () => {
        const mockUserId = new mongoose.Types.ObjectId();

        mockingoose(User).toReturn({}, "findByIdAndDelete");

        // token triggers mocked authMiddleware -> sets req.user.id
        const res = await request(app)
            .delete("/drink/deleteUser")
            .set("Authorization", "Bearer mocktoken");

        expect(res.statusCode).toBe(STATUS_CODES.SUCCESS);
        expect(res.body.message).toBe("User deleted");
    });

    /* ---------------------------------------------------
     * DELETE /deleteUserByID (requires admin role)
     * --------------------------------------------------- */
    it("DELETE /deleteUserByID should delete a user when authorized as admin", async () => {
        const deleteId = new mongoose.Types.ObjectId();

        mockingoose(User).toReturn({}, "findByIdAndDelete");

        // mocked role middleware always allows (unless you mock otherwise)
        const res = await request(app)
            .delete("/drink/deleteUserByID")
            .set("Authorization", "Bearer mocktoken")
            .send({ id: deleteId });

        expect(res.statusCode).toBe(STATUS_CODES.SUCCESS);
        expect(res.body.message).toBe("User deleted");
    });

    /* ---------------------------------------------------
     * POST /getUserId
     * --------------------------------------------------- */
    it("POST /getUserId should return user's ID", async () => {
        const userId = new mongoose.Types.ObjectId();

        const mockUser = {
            _id: userId,
            email: "person@example.com"
        };

        mockingoose(User).toReturn(mockUser, "findOne");

        const res = await request(app)
            .get("/drink/getUserId")
            .set("Authorization", "Bearer mocktoken")
            .send({ email: "person@example.com" });

        expect(res.statusCode).toBe(STATUS_CODES.SUCCESS);
        expect(res.body.usersEmail).toBe("person@example.com");
        expect(res.body.usersId).toBe(String(userId));
    });
});

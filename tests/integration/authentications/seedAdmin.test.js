import request from "supertest";
import { seedAdmin } from "../../../src/authentication/seedAdmin.js";
import UserRoles from "../../../src/models/userRoles.js";
import Users from "../../../src/models/users.js";
import mongoose from "mongoose";
import mockingoose from "mockingoose";
import { jest } from "@jest/globals";

describe("SeedAdmin integration testing", () => {

    it("Admin already exist end creation early", async () => {
        // Arrange
        const username = "FakeAdmin@Test.com"
        process.env.APP_ADMIN_USERNAME = username;
        process.env.APP_ADMIN_PASSWORD = "secret";        

        mockingoose(Users).toReturn({}, "findOne");

        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        // Act
        await seedAdmin();

        // Assert
        expect(consoleSpy).toHaveBeenCalledWith("Admin user already exists. Skipping creation.");
        consoleSpy.mockRestore();
    });

    it("Should go through the process creating the admin user", async () => {
        // Arrange
        const adminUserRole = {_id: "123123123123", role: "admin"};
        const username = "FakeAdmin@Test.com"
        process.env.APP_ADMIN_USERNAME = username;
        process.env.APP_ADMIN_PASSWORD = "secret";        

        mockingoose(Users).toReturn(null, "findOne");
        mockingoose(UserRoles).toReturn(adminUserRole, "findOneAndUpdate");
        mockingoose(UserRoles).toReturn({}, "save");
        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        //Act
        await seedAdmin();

        //Assert
        expect(consoleSpy).toHaveBeenCalledWith(`Admin user '${username.toLowerCase()}' created successfully.`);
        consoleSpy.mockRestore();
    });
});

import request from "supertest";
import app from "../../src/app.js";
import { STATUS_CODES } from "../../src/config/constants.js";
import mockingoose from "mockingoose";
import DrinkRecipe from "../../src/models/drinkRecipe.js";
import Ingredients from "../../src/models/ingredients.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const filePath = path.resolve(dirname, "../../src/config/testData/drinks_start_A.json");
export const START_DATA = JSON.parse(fs.readFileSync(filePath, "utf-8"));

import { beforeEach, jest } from "@jest/globals";

describe("Drink API Integration Tests", () => {
    beforeEach(() => {
        jest.resetModules(); // Clear the module cache
        consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        processExitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});
    })

    it("should not connect to DB or start server in test environment", async () => {
        process.env.NODE_ENV = "test";

        const app = await import("../../src/app.js"); // module is re-evaluated

        // DB connection should not be attempted
        expect(consoleLogSpy).not.toHaveBeenCalledWith(
            expect.stringContaining("Connecting to MongoDB")
        );
    });

    it("should attempt to connect to DB in production environment", async () => {
        process.env.NODE_ENV = "production";

        // Mock DB connection to prevent real DB call
        const mockConnectDB = jest.fn().mockResolvedValue();
        jest.doMock("../../src/db/index.js", () => ({
            connectDB: mockConnectDB
        }));

        const app = await import("../../src/app.js");

        //expect(mockConnectDB).toHaveBeenCalled();
        expect(consoleLogSpy).toHaveBeenCalledWith(
            expect.stringContaining("Connecting to MongoDB")
        );
    });

    it("GET /drink/health should return health status", async () => {
        // Act
        const res = await request(app).get("/drink/health");

        // Assert
        expect(res.statusCode).toBe(STATUS_CODES.SUCCESS);
        expect(res.body.apiCalled).toBe("ok");
        expect(typeof res.body.mongoStatus).toBe("string");
        expect(res.body.mongoStatus.length).toBeGreaterThan(0);
    });

    it("GET /api-docs should load Swagger UI", async () => {
        // Act
        const res = await request(app)
            .get("/api-docs")
            .redirects(1);    // follow the 301 redirect

        // Assert
        expect(res.statusCode).toBe(STATUS_CODES.SUCCESS);
        expect(res.text).toMatch(/Swagger UI/i);
    });

    it("GET /api-docs should handle based on production", async () => {
        // Act
        process.env.NODE_ENV = "production";

        const res = await request(app)
            .get("/api-docs")
            .redirects(1);    // follow the 301 redirect

        // Assert
        expect(res.statusCode).toBe(STATUS_CODES.SUCCESS);
        expect(res.text).toMatch(/Swagger UI/i);
    });

    
    it("should warn and fallback to localhost if MONGO_URI is undefined and not in production", async () => {
        process.env.NODE_ENV = "development";
        process.env.MONGO_URI = "";

        const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
        const processExitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});

        const { getMongoURI } = await import("../../src/config/config.js");

        const MONGO_URI = getMongoURI(); // triggers warning after spy is installed

        // Assert
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            expect.stringContaining("falling back to localhost")
        );
        expect(MONGO_URI).toBe("mongodb://localhost:27017/drink");
        expect(processExitSpy).not.toHaveBeenCalled();
    });

        
  
    it("should error and exit if MONGO_URI is undefined in production", async () => {
        // Arrange
        process.env.MONGO_URI = "";

        process.env.NODE_ENV = "production";
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        const processExitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});

        // Act
        const { getMongoURI } = await import("../../src/config/config.js");
        const MONGO_URI = getMongoURI();

        // Assert
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining("MONGO_URI is not defined")
        );
        expect(processExitSpy).toHaveBeenCalledWith(1);
        expect(MONGO_URI).toBe("");

    });   
});

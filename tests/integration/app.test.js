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
    })

    /*it("GET / should return running message", async () => {
        // Act
        const res = await request(app).get("/");

        // Assert
        expect(res.statusCode).toBe(STATUS_CODES.SUCCESS);
        expect(res.text).toMatch(/Drink API is running/i);
    });*/

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
        
        const processExitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});

        const { getMongoURI } = await import("../../src/config/config.js");

        const MONGO_URI = getMongoURI(); // triggers warning after spy is installed

        expect(MONGO_URI).toBe("mongodb://localhost:27017/drink");
        expect(processExitSpy).not.toHaveBeenCalled();
    });

    /*
    it("should error and exit if MONGO_URI is undefined in production", async () => {
        delete process.env.MONGO_URI;
        process.env.NODE_ENV = "production";
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        const processExitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});

        const { getMongoURI } = await import("../../src/config/config.js");
        const MONGO_URI = getMongoURI();

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining("MONGO_URI is not defined")
        );
        expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it("should use MONGO_URI from environment if defined", async () => {
        process.env.MONGO_URI = "mongodb://custom:27017/test";
        process.env.NODE_ENV = "development";
        const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        const { MONGO_URI } = await import("../../src/config/config.js");

        expect(MONGO_URI).toBe("mongodb://custom:27017/test");
        expect(consoleWarnSpy).not.toHaveBeenCalled();
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
    */
});

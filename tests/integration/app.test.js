import request from "supertest";
import app from "../../src/app.js";
import { STATUS_CODES } from "../../src/config/constants.js";

describe("Drink API Integration Tests", () => {

    it("GET / should return running message", async () => {
        // Act
        const res = await request(app).get("/");

        // Assert
        expect(res.statusCode).toBe(STATUS_CODES.SUCCESS);
        expect(res.text).toMatch(/Drink API is running/i);
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
});

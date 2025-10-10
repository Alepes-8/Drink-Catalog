import app from "../../src/app.js"
import request from "supertest";

describe("Drink Integration Tests", () => {

    it("should respond on root route", async () => {
        //arrange
        const res = await request(app).get("/");

        //assert
        expect(res.statusCode).toBe(200);
        expect(res.text).toMatch(/Drink API is running.../i); // or whatever your root returns
    });

    it("should have /drink route mounted", async () => {
        //arrange
        const res = await request(app).get("/drink/health");

        //assert
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ status: "ok" });
    });
});

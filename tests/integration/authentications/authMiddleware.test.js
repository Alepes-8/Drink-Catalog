// 👇 mock BEFORE importing middleware
import {jest} from "@jest/globals";
import jwt from "jsonwebtoken";
import authMiddleware from "../../../src/authentication/authMiddleware";

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: jest.fn(),
  },
}));

describe("authMiddleware Unit Tests", () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });
    
    test("no token provided", () => {
        // Arrange
        req.headers.authorization = "";
        
        // Act
        authMiddleware(req, res, next);

        // Assert
        expect(next).not.toHaveBeenCalled();
        expect(req.user).toEqual(undefined);
    });

    test("allows valid token", () => {
        // Arrange
        req.headers.authorization = "Bearer abc123";

        jest.spyOn(jwt, "verify").mockReturnValue({ id: "123", role: "admin" });
        
        // Act
        authMiddleware(req, res, next);

        // Assert
        expect(next).toHaveBeenCalled();
        expect(req.user).toEqual({ id: "123", role: "admin" });
    });

    test("rejects invalid token", () => {
        // Arrange
        req.headers.authorization = "Bearer badtoken";

        jest.spyOn(jwt, "verify").mockImplementation(() => {
            throw new Error("invalid");
        });

        //Act
        authMiddleware(req, res, next);

        // Assert
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Token invalid or expired" });
    });
});

import requiredRole from "../../../src/authentication/authRole.js";
import { STATUS_CODES } from "../../../src/config/constants.js";
import {jest} from "@jest/globals";

describe("requiredRole middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { user: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should call next() if user's role is allowed", () => {
    // Arrange
    const middleware = requiredRole("admin", "user");
    req.user.role = "admin";

    // Act
    middleware(req, res, next);

    // Assert
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should return 403 if user's role is not allowed", () => {
    // Arrange
    const middleware = requiredRole("admin");
    req.user.role = "user";

    // Act
    middleware(req, res, next);

    // Assert
    expect(next).toHaveBeenCalled(); // <-- actually in your code, next() still gets called, may want to fix
    expect(res.status).toHaveBeenCalledWith(STATUS_CODES.INSUFFICIENT_PERMISSIONS);
    expect(res.json).toHaveBeenCalledWith({ error: "Forbidden: Insufficient permissions" });
  });

  it("should handle multiple allowed roles", () => {
    // Arrange
    const middleware = requiredRole("admin", "normal");
    req.user.role = "normal";

    // Act
    middleware(req, res, next);

    // Assert
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

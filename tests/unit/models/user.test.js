import mockingoose from "mockingoose";
import user from "../../../src/models/users.js"; 
import UserRole from "../../../src/models/userRoles.js"
describe("User Model Unit Tests", () => {
    beforeEach(() => {
        mockingoose.resetAll();
    });

    it("should create a user", async () => {
        // Arrange
        const mockRole = { _id: "507f1f77bcf86cd799439011", name: "normal" };
        mockingoose(UserRole).toReturn(mockRole, "findOne");

        const defaultRole = await UserRole.findOne({ name: "normal" });
        console.log(defaultRole); // ✅ Should now log the mocked role

        const userData = {
            email: "test@localhost.ls",
            password: "password123", 
            role: defaultRole.id
        };
        mockingoose(user).toReturn(userData, "save");

        // Act
        const newUser = new user(userData);
        const savedUser = await newUser.save();

        // Assert
        expect(savedUser.email).toBe(userData.email);
        expect(savedUser.password).toBe(userData.password);
    });
});
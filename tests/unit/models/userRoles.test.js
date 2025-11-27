import mockingoose from "mockingoose";
import UserRoles from "../../../src/models/userRoles.js";

describe("UserRoles Model Unit Tests", () => {
    beforeEach(() => mockingoose.resetAll());

    it("should create a user role", async () => {
        const roleData = { name: "normal" };

        mockingoose(UserRoles).toReturn(roleData, "save");

        const role = new UserRoles(roleData);
        const saved = await role.save();

        expect(saved.name).toBe("normal");
    });
});

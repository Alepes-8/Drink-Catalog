import userRoles from "../models/userRoles.js";
import Users from "../models/users.js";
import bcrypt from "bcryptjs";

export async function seedAdmin() {
    const username = process.env.APP_ADMIN_USERNAME.toLowerCase();
    const password = process.env.APP_ADMIN_PASSWORD?.trim();
    await Users.deleteMany({}); // Deletes all users  // TODO : Remove this line after testing

    if (!username || !password) {
    console.warn("APP_ADMIN_USERNAME or APP_ADMIN_PASSWORD not set. Skipping admin seed.");
    return;
    }

    const existing = await Users.findOne({email: username });

    if (existing) {
    console.log("Admin user already exists. Skipping creation.");
    return;
    }

    const userRole = await userRoles.findOneAndUpdate(
        { name: "admin" },           // Query
        { $set: { name: "admin" } }, // Update
        { upsert: true, new: true }  // Options: create if missing + return updated doc
    );
    await userRoles.findOneAndUpdate(
        { name: "normal" },           // Query
        { $set: { name: "normal" } }, // Update
        { upsert: true, new: true }  // Options: create if missing + return updated doc
    );
    console.log("Created admin role with ID:", userRole);

    await Users.create({
        email: username,
        password: password,
        role: userRole._id
    });

    console.log(`Admin user '${username}' created successfully.`);
}

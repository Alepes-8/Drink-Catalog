import mongoose from "mongoose";
import { MODEL_TYPES } from "../config/constants.js";
import bcrypt from "bcryptjs";
import UserRoles from "./userRoles.js";
import Ratings from "./ratings.js";
import Notes from "./notes.js";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true},
    password: { type: String, required: true },
    role: { type: mongoose.Types.ObjectId, ref: MODEL_TYPES.USER_ROLES, default: null }
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);

    if (!this.role) {
        const normalRole = await UserRoles.findOne({ name: "normal" });
        if (!normalRole) throw new Error("Default role 'normal' not found");
        this.role = normalRole._id;
    }
    next();
});

userSchema.pre("findByIdAndDelete", async function (next) {
    const userId = this.getQuery()._id;

    await Promise.all([
        Notes.deleteMany({ userId }),
        Ratings.deleteMany({ userId })
    ]);

    next();
});

export default mongoose.model(MODEL_TYPES.USER, userSchema);
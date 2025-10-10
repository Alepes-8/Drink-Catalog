import mongoose from "mongoose";
import { MODEL_TYPES } from "../config/constants.js";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true},
    password: { type: String, required: true },
    role: {type: mongoose.Types.ObjectId, ref: MODEL_TYPES.USER_ROLES, required: true}
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export default mongoose.model(MODEL_TYPES.USER, userSchema);
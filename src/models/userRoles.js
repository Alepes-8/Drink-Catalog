import mongoose from "mongoose";
import { MODEL_TYPES } from "../config/constants.js";

const userRolesSchema = new mongoose.Schema({
    name: {type: String, enum: ["admin", "normal"], default: "normal"},
});

export default mongoose.model(MODEL_TYPES.USER_ROLES, userRolesSchema);
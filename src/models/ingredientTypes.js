import mongoose from "mongoose";
import { MODEL_TYPES } from "../config/constants.js";

const ingredientTypesSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true}
});

export default mongoose.model(MODEL_TYPES.INGREDIENT_TYPES, ingredientTypesSchema);
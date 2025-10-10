import mongoose from "mongoose";
import { MODEL_TYPES } from "../config/constants.js";

const ingredientsSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    type: [{type: mongoose.Schema.Types.ObjectId, ref: MODEL_TYPES.INGREDIENT_TYPES, required: true}]
});

export default mongoose.model(MODEL_TYPES.INGREDIENTS ,ingredientsSchema);
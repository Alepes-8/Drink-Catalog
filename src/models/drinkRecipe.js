import mongoose from "mongoose";
import { MODEL_TYPES } from "../config/constants.js";

const drinkSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    ingredients: [{type: mongoose.Types.ObjectId, ref: MODEL_TYPES.INGREDIENTS, required: true }],
    instructions: {type: String, trim: true}
});

export default mongoose.model(MODEL_TYPES.DRINK , drinkSchema);
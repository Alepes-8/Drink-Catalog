import mongoose from "mongoose";
import { MODEL_TYPES } from "../config/constants.js";

const ratingsSchema = new mongoose.Schema({
    drinkID: {type: mongoose.Types.ObjectId, ref: MODEL_TYPES.DRINK},
    userId: {type: mongoose.Types.ObjectId, ref: MODEL_TYPES.USER},
    rating: {type: Number, min: 1, max: 10, required: true}
});

export default mongoose.model(MODEL_TYPES.RATINGS, ratingsSchema);
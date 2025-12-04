import mongoose from "mongoose";
import { MODEL_TYPES } from "../config/constants.js";

const notesSchema = new mongoose.Schema({
    drinkID: {type: mongoose.Types.ObjectId, ref: MODEL_TYPES.DRINK, required: true},
    userId: {type: mongoose.Types.ObjectId, ref: MODEL_TYPES.USER, required: true},
    notes: {type: String, required: true, trim: true}
});

export default mongoose.models.notes || mongoose.model(MODEL_TYPES.NOTES, notesSchema);
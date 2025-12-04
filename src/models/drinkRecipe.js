import mongoose from "mongoose";
import { MODEL_TYPES } from "../config/constants.js";
import Ingredients from "./ingredients.js";

const drinkSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    ingredients: [{type: mongoose.Types.ObjectId, ref: MODEL_TYPES.INGREDIENTS, required: true }],
    instructions: {type: String, trim: true},
    ingredientNames: [{type: String, trim: true, select: false}] // tempurary input field. select means it won't be returned unless specificly asked for
});

drinkSchema.pre("save", async function (next){

    if(!(this.ingredientNames) || this.ingredientNames.length === 0) return next();

    let filteredIngredients = this.ingredientNames.map(ingredient => ({
        updateOne: {
            filter: {
                name: ingredient.toLowerCase() , // match existing by name
            },
            update: {
                $set:  {
                    name: ingredient.toLowerCase(), 
                }
            },
            upsert: true
        }
    }));

    await Ingredients.bulkWrite(filteredIngredients)

    const ingredientDocs = await Ingredients.find({
        name: { $in: this.ingredientNames.map(n => n.toLowerCase()) }
    });
        
    this.ingredients = ingredientDocs.map(doc => doc._id);

    next();
});

export default mongoose.models[MODEL_TYPES.DRINK]
  || mongoose.model(MODEL_TYPES.DRINK, drinkSchema);

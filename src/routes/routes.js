import express from "express";
import drinkRecipe from "../models/drinkRecipe.js";
import ingredients from "../models/ingredients.js"
import ingredientType from "../models/ingredientTypes.js"
import notes from "../models/notes.js"
import ratings from "../models/ratings.js"
import users from "../models/users.js"

import {STATUS_CODES, MODEL_TYPES} from '../config/constants.js';

const router = express.Router();

router.get("/health", async(req, res) => {
    res.status(STATUS_CODES.SUCCESS).json({status: 'ok'})
})

/** TODO
 * Create a get function in which it handles different inputs values each time
 *      - Get data based on country
 *      - Get data based on genre
 *      - get data based on platform
 *      - Get data based on title
 *      - Get data based on year
 */

export default router;
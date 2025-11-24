
import {STATUS_CODES, STATUS_MESSAGES} from '../config/constants.js';
import mongoose from 'mongoose';
import DrinkRecipe from '../models/drinkRecipe.js';
import ingredients from '../models/ingredients.js';
import Notes from '../models/notes.js';
import Ratings from '../models/ratings.js';

export const healthCheck = async (req, res) => {
    res.status(STATUS_CODES.SUCCESS).json({apiCalled: 'ok', mongoStatus: await checkMongoAlive()})
}

async function checkMongoAlive() {
    try {
        await mongoose.connection.db.admin().ping();
        return "MongoDB reachable ✅";
    } catch (err) {
        return "MongoDB NOT reachable ❌";
    }
};

export const searchDrinksByName = async (req, res) => {
    // 1 get the input data from req.query and fix them for security
    const nameToSearch = req.query.drinkName.toString().toLowerCase();

    // 2 search the databbase based on the input name
    const result = await DrinkRecipe.find({name: { "$regex": nameToSearch, "$options": "i" }})            
        .limit(50)
        .exec();  //TODO, verify that it returns results, event with partioal inputs.
    
    result = convertIngredientsIdToName(result)

    // 3 return the resulting search
    res.status(STATUS_CODES.SUCCESS).json(result)
};

export const searchDrinksByIngredients = async (req, res) => {
    // 1 get the input data from req.query and fix them for security
    const ingredientsToSeach = req.body.ingredients; 
    const typeOfSearch = req.query.typeOfSearch         // If they want drinks that include the given ingredients or just those that include all of them

    // 2 search the databbase based on the input ingredients
    const filter = {};
    if(typeOfSearch && typeOfSearch === "includeAll"){
        filter.ingredients = {$all: ingredientsToSeach}; // All ingredients must be present

    }else if(typeOfSearch && typeOfSearch === "exclude"){
        filter.ingredients = {$not: ingredientsToSeach}; // None of the ingredients must be present

    }else{
        filter.ingredients = {$in: ingredientsToSeach}; // At least one of the ingredients must be present
    };

    const result = await DrinkRecipe.find(filter)
            .limit(50)
            .exec();

    result = convertIngredientsIdToName(result);

    // 3 return the resulting search
    res.status(STATUS_CODES.SUCCESS).json({result});
};

async function convertIngredientsIdToName(recipes) {
    if (recipes.length > 0) {
        for (const drink of result) {

            const ingredientDocs = await Ingredient.find({
            _id: { $in: drink.ingredients }
            }).exec();

            // Replace IDs with names
            drink.ingredients = ingredientDocs.map(i => i.name);
        }
    };
    return recipes;
}

// Get all information from the drink correlating to the user
export const getDrinkInformation = async (req, res) => {
    // 1 get the req id for the drink
    const drinkId = req.query.drinkId.toString();
    const returnValue = {}

    // 2 get the information from the drink, that includes the drink, ingredients, notes, and ratings
    returnValue.drinkData = await DrinkRecipe.find({_id: drinkId}).exec();
    drinkData = convertIngredientsIdToName(drinkData);

    returnValue.notes = await Notes.findOne({$and: {drinkID: drinkId, userId: req.user.id}}).exec();
    returnValue.userRating = await Ratings.findOne({$and: {drinkID: drinkId, userId: req.user.id}}).exec();
    
    // 3 return the drink information
    res.status(STATUS_CODES.SUCCESS).json({returnValue})
};

export const updateDrinkNote = async (req, res) => {
    try{
        // 1 get the user id to know whoes note to update and get the recipe id for which recipe to update.
        const drinkId = req.query.drinkId.toString();
        const notes = req.query.notes.toString().toLowerCase().lean();

        // 2 update the notes for the user to se on the drink
        await Notes.findOneAndUpdate({$and: {drinkID: drinkId, userId: req.user.id}}, notes, {new: true});

        // 3 return status
        res.status(STATUS_CODES.SUCCESS).json({message: STATUS_MESSAGES.SUCCESS_NOTE_UPDATE})
    }catch(err){
        res.status(STATUS_CODES.SERVER_ERROR).json({error: err});
    };
};

export const updateDrinkRating = async (req, res) => {    
    try{
        // 1 get the user id to know whoes note to update and get the recipe id for which recipe to update.
        const drinkId = req.query.drinkId.toString();
        const rating = req.query.rating;

        // 2 update the notes for the user to se on the drink
        await Ratings.findOneAndUpdate({$and: {drinkID: drinkId, userId: req.user.id}}, rating, {new: true});

        // 3 return status
        res.status(STATUS_CODES.SUCCESS).json({message: STATUS_MESSAGES.SUCCESS_RATING_UPDATE})
    }catch(err){
        res.status(STATUS_CODES.SERVER_ERROR).json({error: err});
    };
};

export default { 
    healthCheck, 
    searchDrinksByName, 
    searchDrinksByIngredients, 
    getDrinkInformation,
    updateDrinkNote, 
    updateDrinkRating
};
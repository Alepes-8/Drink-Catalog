
import {STATUS_CODES, STATUS_MESSAGES} from '../config/constants.js';
import mongoose from 'mongoose';
import DrinkRecipe from '../models/drinkRecipe.js';
import Ingredients from '../models/ingredients.js';
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
    try{
        // 1 get the input data from req.query and fix them for security
        const nameToSearch = req.query.drinkName.toString().toLowerCase();

        // 2 search the databbase based on the input name
        let result = await DrinkRecipe.find({name: { "$regex": nameToSearch, "$options": "i" }})            
            .populate("ingredients")
            .limit(50)
            .exec();  //TODO, verify that it returns results, event with partioal inputs.
        

        // 3 return the resulting search
        res.status(STATUS_CODES.SUCCESS).json(result)
    }catch(err){
        res.status(STATUS_CODES.SERVER_ERROR).json({error: err.message});
    }
};

export const searchDrinksByIngredients = async (req, res) => {
    try{
        // 1 get the input data from req.query and fix them for security
        const typeOfSearch = req.query.typeOfSearch         // If they want drinks that include the given ingredients or just those that include all of them

        const uniqueIngredientNames = [
            ...new Set(req.body.ingredients)
        ];

        // 2 search the databbase based on the input ingredients
        const ingredientIds = await Ingredients.find({
            name: { $in: uniqueIngredientNames }
        });
        
        const ingredientIdstests = await Ingredients.find();
        const test = ingredientIdstests.map(item => [item._id, item.name])

        const filter = {};
        if(typeOfSearch && typeOfSearch === "includeAll"){
            filter.ingredients = {$all: ingredientIds}; // All ingredients must be present

        }else if(typeOfSearch && typeOfSearch === "exclude"){
            filter.ingredients = {$not: ingredientIds}; // None of the ingredients must be present

        }else{
            filter.ingredients = {$in: ingredientIds}; // At least one of the ingredients must be present
        };

        let result = await DrinkRecipe.find(filter)
                .populate("ingredients")
                .limit(50)
                .exec();

        // 3 return the resulting search
        res.status(STATUS_CODES.SUCCESS).json({result});
    }catch(err){
        res.status(STATUS_CODES.SERVER_ERROR).json({error: err.message});
    }
};

// Get all information from the drink correlating to the user
export const getDrinkInformation = async (req, res) => {
    try{
        // 1 get the req id for the drink
        const drinkId = req.query.drinkId.toString();
        const returnValue = {}

        // 2 get the information from the drink, that includes the drink, ingredients, notes, and ratings
        returnValue.drinkData = await DrinkRecipe.find({_id: drinkId}).populate("ingredients").exec();

        returnValue.notes = await Notes.findOne({    
            $and: [
                { drinkID: drinkId },
                { userId: req.user.id }
        ]}).exec();
        
        returnValue.userRating = await Ratings.findOne({
            $and: [
                { drinkID: drinkId },
                { userId: req.user.id }
        ]}).exec();
        
        // 3 return the drink information
        res.status(STATUS_CODES.SUCCESS).json({returnValue})
    }catch(err){
        res.status(STATUS_CODES.SERVER_ERROR).json({error: err.message});
    }
};

export const updateDrinkNote = async (req, res) => {
    try{
        // 1 get the user id to know whoes note to update and get the recipe id for which recipe to update.
        const drinkId = req.query.drinkId.toString();
        const notes = req.body.notes.toString().toLowerCase();
        // 2 update the notes for the user to se on the drink
        await Notes.findOneAndUpdate({
            $and: [
                {drinkID: drinkId},
                {userId: req.user.id}
        ]}, notes, {new: true});

        // 3 return status
        res.status(STATUS_CODES.UPDATE_SUCCESS).json({message: STATUS_MESSAGES.SUCCESS_NOTE_UPDATE})
    }catch(err){
        res.status(STATUS_CODES.SERVER_ERROR).json({error: err.message});
    };
};

export const updateDrinkRating = async (req, res) => {    
    try{
        // 1 get the user id to know whoes note to update and get the recipe id for which recipe to update.
        const drinkId = req.query.drinkId.toString();
        const rating = Number(req.body.rating);

        if(rating <1 || rating > 10){
            res.status(STATUS_CODES.SUCCESS).json({message: STATUS_MESSAGES.SUCCESS_RATING_UPDATE});
            return;
        }

        // 2 update the notes for the user to se on the drink
        await Ratings.findOneAndUpdate({
            $and: [
                {drinkID: drinkId}, 
                {userId: req.user.id}
        ]}, rating, {new: true});

        // 3 return status
        res.status(STATUS_CODES.UPDATE_SUCCESS).json({message: STATUS_MESSAGES.SUCCESS_RATING_UPDATE})
    }catch(err){
        res.status(STATUS_CODES.SERVER_ERROR).json({error: err.message});
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
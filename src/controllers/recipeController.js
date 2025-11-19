
import {STATUS_CODES} from '../config/constants.js';
import mongoose from 'mongoose';

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

export const searchDrinksByName = async (req, res) => {};

export const searchDrinksByIngredients = async (req, res) => {};

export const updateDrinkNote = async (req, res) => {};

export const updateDrinkRating = async (req, res) => {};

export default { 
    healthCheck, 
    searchDrinksByName, 
    searchDrinksByIngredients, 
    updateDrinkNote, 
    updateDrinkRating
};
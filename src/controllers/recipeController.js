
import {STATUS_CODES} from '../config/constants.js';

export const healthCheck = async (req, res) => {
    res.status(STATUS_CODES.SUCCESS).json({status: 'ok'})
}

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
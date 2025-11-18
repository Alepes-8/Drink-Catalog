
import {STATUS_CODES, API_WAIT_TIMES, APIS_CALLS, DEFUALT_VALUES, STATUS_MESSAGES} from '../config/constants.js';
import { WATCHMODE_API_KEY } from '../config/config.js';

export const healthCheck = async (req, res) => {
    res.status(STATUS_CODES.SUCCESS).json({status: 'ok'})
}

export const login = async (req, res) => {};

export const register = async (req, res) => {};

export const searchDrinksByName = async (req, res) => {};

export const searchDrinksByIngredients = async (req, res) => {};

export const updateDrinkNote = async (req, res) => {};

export const updateDrinkRating = async (req, res) => {};

export default { 
    healthCheck, 
    login, 
    register, 
    searchDrinksByName, 
    searchDrinksByIngredients, 
    updateDrinkNote, 
    updateDrinkRating
};
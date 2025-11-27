
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.js";
import UserRoles from '../models/userRoles.js';
import {STATUS_CODES} from '../config/constants.js';

export const register = async (req, res) => {
    try {
        const userData = {};
        if (req.body.email) userData.email = req.body.email.toString().toLowerCase();
        if (req.body.password) userData.password = req.body.password.toString();

        await User.create(userData);

        res.status(STATUS_CODES.CREATION_SUCCESS).json({ message: "User registered" });
    } catch (err) {
        // 👇 ADD THIS (THIS IS WHAT YOU NEED)
        console.error("REGISTER ERROR:", err);

        res.status(STATUS_CODES.SERVER_ERROR).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    try{
        const userInput = {}
        userInput.email = req.body.email?.toString().toLowerCase();
        userInput.password = req.body.password?.toString().trim();

        // 1 find user and verify password
        const user = await User.findOne({email: userInput.email});
        
        if(!user || !(await bcrypt.compare(userInput.password, user.password))){
           return res.status(STATUS_CODES.INVALID_INPUT).json({ error: "Invalid credentials" });
        };
        
        const userRole = await UserRoles.findById(user.role);

        // 2 create a JWT
        const token = jwt.sign(
            {                           //payload
                id: user._id,           // User ID
                role: userRole.name     // User Role
            },           
            process.env.JWT_SECRET,      // secret from .env
            { expiresIn: "1h" }          // optional expiration
        );
        
        // 4. Send back token
        res.status(STATUS_CODES.SUCCESS).json({token});

    }catch(err){
        res.status(STATUS_CODES.SERVER_ERROR).json({error: err.message})
    }
};

//TODO adjust so that the user can delete only their own account unless admin
export const deleteUser = async (req, res) => {
    try{
        await User.findByIdAndDelete(req.user.id);
        res.status(STATUS_CODES.SUCCESS).json({message: "User deleted"})
    } catch(err){
        res.status(400).json({error: err.message})
    }
};

export const deleteUserByID = async (req, res) => {
    try{
        await User.findByIdAndDelete(req.body.id);

        res.status(STATUS_CODES.SUCCESS).json({message: "User deleted"})
    } catch(err){
        res.status(400).json({error: err.message})
    }
};

export const getUserId = async (req, res) => {
    try{
        const user = await User.findOne({email: req.body.email.toLowerCase()});
        res.status(STATUS_CODES.SUCCESS).json({usersEmail: user.email, usersId:user._id})
    } catch(err){
        res.status(400).json({error: err.message})
    }
};

export const updateUser = async (req, res) => {
    //TODO
    res.json({message: "Not implemented yet"});
};

export default { 
    login, 
    register, 
    deleteUser,
    updateUser,
    deleteUserByID,
    getUserId
};
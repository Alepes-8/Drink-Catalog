
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.js";
import UserRoles from '../models/userRoles.js';
import {STATUS_CODES} from '../config/constants.js';

export const register = async (req, res) => {
    try{
        const userData = {}
        if(req.body.email) userData.email = req.body.email.toString().toLowerCase();
        if(req.body.password) userData.password = req.body.password.toString();
        
        const user = new User(userData)
        await user.save();
        res.status(STATUS_CODES.CREATION_SUCCESS).json({ message: "User registered"});
    }catch(err){
        res.status(STATUS_CODES.SERVER_ERROR).json({error: err});
    }
};

export const login = async (req, res) => {
    try{
        const userInput = {}
        userInput.email = req.body.email?.toString().toLowerCase();
        userInput.password = req.body.password?.toString().trim();

        // 1 find user and verify password
        const user = await User.findOne({email: userInput.email});
        const userRole = await UserRoles.findById(user.role);
            

        if(!user || !(await bcrypt.compare(userInput.password, user.password))){
           return res.status(STATUS_CODES.INVALID_INPUT).json({ error: "Invalid credentials" });
        };

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

export const deleteUser = async (req, res) => {
    try{
        await Task.findByIdAndDelete(req.params.id);
        res.json({message: "Task deleted"})
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
    updateUser
};
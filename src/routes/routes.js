import express from "express";
import recipeController from "../controllers/recipeController.js";
import authenticationController from "../controllers/authenticationController.js";
import auth from "../authentication/authMiddleware.js"
import requiredRole from "../authentication/authRole.js";

const router = express.Router();

router.post("/login", authenticationController.login)
router.post("/register", authenticationController.register)
router.delete("/deleteUser", auth, authenticationController.deleteUser)
router.delete("/deleteUserByID", auth, requiredRole("admin"), authenticationController.deleteUserByID)

router.get("/health", recipeController.healthCheck)
router.get("/searchByName", auth, recipeController.searchDrinksByName)
router.post("/searchByIngredients", auth, recipeController.searchDrinksByIngredients)
router.get("/getDrinkById", auth, recipeController.getDrinkInformation)
router.put("/updateDrinkNote", auth, recipeController.updateDrinkNote)
router.put("/updateDrinkRating", auth, recipeController.updateDrinkRating)
router.get("/getUserId", auth, requiredRole("admin"), authenticationController.getUserId)

export default router;
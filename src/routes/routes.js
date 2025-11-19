import express from "express";
import recipeController from "../controllers/recipeController.js";
import authenticationController from "../controllers/authenticationController.js";
import auth from "../authentication/authMiddleware.js"
import requiredRole from "../authentication/authRole.js";

const router = express.Router();

router.get("/login", authenticationController.login)
router.post("/register", authenticationController.register)
router.delete("/deleteUser", auth, requiredRole("admin"), authenticationController.deleteUser)

router.get("/health", recipeController.healthCheck)
router.get("/searchByName", auth, recipeController.searchDrinksByName)
router.get("/searchByIngredients", auth, recipeController.searchDrinksByIngredients)
router.put("/updateDrinkNote", auth, recipeController.updateDrinkNote)
router.put("/updateDrinkRating", auth, recipeController.updateDrinkRating)

export default router;
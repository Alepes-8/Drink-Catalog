export const STATUS_CODES = {
  SUCCESS: 200,
  CREATION_SUCCESS: 201,
  UPDATE_SUCCESS: 202,
  INVALID_INPUT: 401,
  INSUFFICIENT_PERMISSIONS: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

export const MODEL_TYPES = {
  DRINK: "drinkRecipes",
  INGREDIENTS: "ingredients",
  RATINGS: "ratings",
  NOTES: "notes",
  USER: "user",
  USER_ROLES: "userRoles"
}

export const STATUS_MESSAGES = {
  SUCCESS_NOTE_UPDATE: "Notes for the recipe has been updated",
  SUCCESS_RATING_UPDATE: "Ratings for the recipe has been updated",
  UNSUCCESSFUL_RATING_UPDATE: "Ratings for the recipe has stopped, rating is between 1-10",

}


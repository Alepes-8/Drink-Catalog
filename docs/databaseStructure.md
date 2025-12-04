# Database Structure

The database and system are run using MongoDB.

The structure is designed to allow updates and additions with minimal difficulty. This ensures that changes to `DrinkRecipe` or any other collection can be made easily, improving the modularity of the codebase. Additionally, the system is built to handle two main tasks: user authentication and drink recipe management.  

- **Drink Recipe Management:** This involves searching for drinks, rating them, and adding personal notes.  
- **User Authentication:** This allows users to create accounts and, once logged in, manage their own ratings and notes for drinks. Each user’s notes and ratings are unique to their account and can be updated at any time.

## Overall Structure

The database structure centers around the `DrinkRecipe` and `User` models:

- **DrinkRecipe Model:** Uses the `Ingredients` model to link recipes to their corresponding ingredients. This facilitates efficient searching and filtering of recipes.  
- **User Model:** Uses the `UserRoles` model to determine the authority level of the user when logged in.  
- **Notes and Ratings Models:** These are not directly referenced by `DrinkRecipe` or `User`. Instead, they use user IDs and recipe IDs to associate notes and ratings with a specific user and recipe, allowing each user to have personalized notes and ratings for every drink.

---

## Overall Relationship Graph

The connection works as follows:  
- **DrinkRecipe** references both **Ingredients**, **notes**, and **ratings** IDs.
- **users** references  **notes**, **ratings**, and **userRoles** IDs. 

          DrinkRecipe    users
            /     |   \ /   |  \
           /      |    X    |   \
          /       |   / \   |    \
  Ingredients    notes  ratings   userRoles



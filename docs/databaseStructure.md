# Database Structure


## Overall Structure

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



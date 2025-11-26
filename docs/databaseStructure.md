# Database Structure


## Overall Structure

---

## Overall Relationship Graph

The connection works as follows:  
- **Availability** references both **Entertainment** and **Platform** IDs.  //TODO 
- **Entertainment** references **Genre** IDs.                               //TODO 

          DrinkRecipe    users
            /     |   \ /   |  \
           /      |    X    |   \
          /       |   / \   |    \
  Ingredients    notes  ratings   userRoles



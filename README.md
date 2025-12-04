# Drink-Catalog

An API for cataloging cocktail recipes, allowing users to search for drinks, save personal ratings, and store notes.  
The system also supports user authentication and integrates with multiple data sources for ingredient and recipe management.

---

# Current Setup

The project is currently deployed on **Render**, with the database hosted on **MongoDB Atlas**.  
This setup makes the API publicly accessible for demonstrations, testing, and development.

To verify that the service is running, visit:

- **Base API URL:**  
  https://drink-catalog-czts.onrender.com/

- **Swagger API Documentation:**  
  https://drink-catalog-czts.onrender.com/api-docs

Swagger provides an interactive interface to test the API directly in the browser.  
From there, you can register users, log in, and interact with protected routes by providing your authentication token.

---

## Swagger

**Swagger Documentation:**  
https://drink-catalog-czts.onrender.com/api-docs

To use protected endpoints in Swagger:

1. **Create a user** via the registration endpoint.
2. **Log in** with the same credentials.
3. Copy the returned **JWT token**.
4. Open the **Authorize** button in the top-right corner of Swagger.
5. Paste the token into the authorization dialog.
6. Apply the token to authenticate your session.

Once authenticated, you can:

- Add or update personal notes on drinks  
- Rate drink recipes  
- Search for cocktails  
- View ingredient details  

### Swagger UI Preview

<img width="1203" height="899" alt="Swagger UI" src="https://github.com/user-attachments/assets/fac38275-4a70-4544-9074-2fa3eee95db7" />

### JWT Authentication Dialog

<img width="536" height="240" alt="Swagger Auth Dialog" src="https://github.com/user-attachments/assets/fb51647e-1834-467d-b672-01c073592535" />

---


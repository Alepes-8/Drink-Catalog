# Render

Render is a publicly available cloud hosting platform where the **Drink Catalog API** has been deployed. This allows the API to be accessed from anywhere and demonstrates a real-world scenario where a working API is deployed to an external hosting environment.

## Deploy

With the current setup, the API code is stored on GitHub, and the project uses **GitHub Actions** for testing and deployment.  
Each pull request from a feature branch triggers automated tests. However, you typically do *not* want deployments to happen automatically on every feature branch, since this would make the production environment unstable and more prone to breaking.

Instead, deployment only occurs when all changes are merged into the **main** branch *and* the main branch tests pass successfully. This ensures that any failures block the deployment, creating a safer and more reliable environment.

The workflow file **`.github/workflows/deploy.yml`** contains the necessary steps for deploying the API to Render.

---

## MongoDB Atlas

To run the application, a MongoDB database must be created and available. To satisfy this requirement, a database cluster was created using **MongoDB Atlas**, utilizing their free tier hosted on **AWS** to store the application data in the cloud.

A key requirement for this connection to work is that MongoDB Atlas must allow Render to access the database. This is done by adding Render’s IP address to the **IP Access List**. Since Render uses dynamic IPs, the only reliable way is to whitelist: 0.0.0.0/0


This allows access from any IP. However, MongoDB Atlas does **not** allow anonymous connections—access still requires:

- a valid username  
- a valid password  
- TLS-encrypted connections  

This means the database remains secure even with a wide IP range whitelisted. For additional safety, you can also create temporary or low-privilege database users instead of granting high-level permissions.

In addition to the whitelist, Render needs to know **which database URI to connect to**. This is done by opening your MongoDB Atlas cluster, clicking **Connect**, and choosing **Connect your application**. Atlas will then display your connection string, which looks similar to:

mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=drinkCatalogDB

MongoDB Atlas does not automatically create databases for you. Instead, a database is created the first time your application writes data to it. This means the first successful write operation will create both the database and its collections.

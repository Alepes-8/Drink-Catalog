# Setup

This API can be deployed and used in several ways depending on your needs, capabilities, and access.  
The system is designed to support:

- **Local development and testing**
- **Local Docker-based deployment**
- **Deployment on an online API hosting service** (e.g., Render)

Each option has advantages depending on your workflow.

---

## Overview

The system is primarily structured to run locally for easy testing, development, and usage. Running locally requires minimal setup and incurs no hosting cost. However, external access to your API may be limited unless additional networking steps are taken.

Running the API through Docker offers a more controlled and consistent environment, making deployment easier for users who prefer containerized workflows.

Lastly, the system supports deployment to external API hosts. This provides easy access for external users and ensures the API is always online. However, exposing an API publicly introduces security considerations and additional setup steps.

---

## Local Setup

A local setup is especially useful for development and testing. It is easy to configure, and you can choose to run it directly from the terminal or through Docker.

Running via Docker provides consistency but can slow down rapid development because the container must be rebuilt each time code changes. Running directly from the terminal is more flexible for testing.

---

### Running Locally (Terminal)

To run the system locally without Docker:

1. Clone the repository into any directory you want.
2. Open a terminal in the **root folder** of the project.
3. Install dependencies:

   ```bash
   npm install
    ```
4. Open a second terminal (can be anywhere on your system).
5. Start MongoDB:
    ```bash
    mongod    
    ```
6. Return to the first terminal and start the API:
    ```bash
    npm start    
    ```
    
### Docker Setup

When running the system locally using Docker Desktop or another Docker environment, follow the steps below:

1. Clone the repository into a folder and location of your choice.
2. Open a terminal in the **root directory** of the project.
3. Start Docker Desktop on your computer and ensure no conflicting containers are running.
4. Build and start the Docker containers:

   ```bash
   docker-compose up --build
   ```
    - This command will build and start the Docker images.  
    Note that containers run inside the terminal session.  
    If you close the terminal, the containers will stop.  
    Simply re-open Docker Desktop or rerun the command to start them again.

---

## Online API Hosting (e.g., Render)

Another recommended option is deploying the API to an online hosting platform such as Render.  
This allows anyone working on the system to access the API without needing a local environment.

However, there are considerations:

- Development and testing become harder because deploying to the main branch may affect other users.
- Your workflow should ideally use separate branches or staging environments.

For detailed deployment steps, refer to **renderDeploy.md**.

---

### Database

If you deploy the API to an online host, you must also configure an external database.  
The recommended option is **MongoDB Atlas**, which is described in **renderDeploy.md**.

A hosted MongoDB instance allows your online API to access data at all times.  
Depending on your use case, the free tier is often sufficient as long as the API is not called excessively.

---


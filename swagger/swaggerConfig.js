// swagger.js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Basic Swagger configuration
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Drink Catalog API",
      version: "1.0.0",
      description: "API documentation for the Drink Catalog project",
    }
  },
  apis: ["./routes/*.js"], // Path to your route files with Swagger annotations
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };

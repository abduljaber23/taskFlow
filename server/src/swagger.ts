import type { Options } from "swagger-jsdoc";
import swaggerJSDoc from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Express TypeScript",
      version: "1.0.0",
      description: "Documentation API with Swagger",
    },
    servers: [{ url: "http://localhost:3310/api" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);

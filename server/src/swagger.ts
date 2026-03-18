import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Express TypeScript",
      version: "1.0.0",
      description: "Documentation API avec Swagger",
    },
    servers: [
      {
        url: "http://localhost:3310/api",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);

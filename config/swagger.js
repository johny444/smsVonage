const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SMS EXTERNAL API",
      version: "1.0.0",
      description: "API to send and verify OTP using Vonage",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        signatureHeader: {
          type: "apiKey",
          in: "header",
          name: "x-signature",
          description: "HMAC SHA256 signature of the request body",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
      {
        signatureHeader: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // or ["./**/*.js"] depending on project structure
};

const swaggerSpec = swaggerJsDoc(options);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;

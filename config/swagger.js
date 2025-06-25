const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "OTP API",
      version: "1.0.0",
      description: "API to send and verify OTP using Vonage",
    },
  },
  apis: ["./routes/*.js"], // You can also use ["./**/*.js"]
};

const swaggerSpec = swaggerJsDoc(options);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;

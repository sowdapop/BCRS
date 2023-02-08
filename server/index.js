/**
 * Require statements
 */
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const swaggerUI = require("swagger-ui-express");
const swaggerJSdoc = require("swagger-jsdoc");
const UserAPI = require("./routes/user-api");
const SecurityQuestionAPI = require("./routes/security-question-api");

const app = express(); // Express variable.

/**
 * App configurations.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../dist/bcrs")));
app.use("/", express.static(path.join(__dirname, "../dist/bcrs")));

// default server port value.
const PORT = process.env.PORT || 3000;

const CONN =
  "mongodb+srv://bcrsAdmin:s3cret@buwebdev-cluster-1.078ar.mongodb.net/bcrs?retryWrites=true&w=majority"; // correct string
  //"mongodb+srv://bcrsuser:s3cret@cluster0.ug54bka.mongodb.net/bcrs?retryWrites=true&w=majority"  // Will's db string for testing


  /**
 * Database connection.
 */
mongoose.set('strictQuery', false); // set strictQuery to false for mongoose 7
mongoose
  .connect(CONN)
  .then(() => {
    console.log("Connection to the database was successful");
  })
  .catch((err) => {
    console.log("MongoDB Error: " + err.message);
  });

/**
 * Swagger Setup
 */
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BCRS",
      version: "1.0.0",
    },
  },
  apis: ["./server/routes/*.js"], // files containing swagger
};
const openapiSpecification = swaggerJSdoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(openapiSpecification));

app.use("/api/users", UserAPI);
app.use("/api/security-questions", SecurityQuestionAPI);

// Wire-up the Express server.
app.listen(PORT, () => {
  console.log("Application started and listening on PORT: " + PORT);
});

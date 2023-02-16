/**
 * Title:  Bob's Computer Repair Shop
 * Authors: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 11 Feb 2023
 * Description: A web application for a computer repair shop
 */

const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const BaseResponse = require("../services/base-response");
const ErrorResponse = require("../services/error-response");

//defines router
const router = express.Router();

//Swagger for user sign in
/**
 * sessionLogin
 * @openapi
 * /api/session/login:
 *   post:
 *     tags:
 *       - Session
 *     description: Login user
 *     summary: Log user into application
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - userName
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User logged in
 *       '401':
 *         description: Invalid username/password
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

//user sign in
router.post("/login", async (req, res) => {
  try {
    //find the username
    User.findOne({ userName: req.body.userName }, function (err, user) {
      if (err) {
        console.log(err);
        const signinMongoDbErrorResponse = new ErrorResponse(
          500,
          "Internal Server Error",
          err
        );
        res.status(500).send(signinMongoDbErrorResponse.toObject());
      } else {
        console.log(user);

        //if the username is valid, compare the password entered with the hashed one
        if (user) {
          let passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
          );

          //if the password is valid, log in
          if (passwordIsValid) {
            console.log("Log-in successful");
            const signinResponse = new BaseResponse(
              200,
              "Log-In successful",
              user
            );
            res.json(signinResponse.toObject());
          } else {
            //if the password is invalid, handle the error
            console.log(`Invalid password for username: ${user.userName}`);
            const invalidPasswordResponse = new BaseResponse(
              401,
              "Invalid username and/or password. Please try again",
              null
            );
            res.status(401).send(invalidPasswordResponse.toObject());
          }
        }
      }
    });
  } catch (e) {
    console.log(e);
    const signinCatchErrorResponse = new ErrorResponse(
      500,
      "Internal Server Error",
      e.message
    );
    res.status(500).send(signinCatchErrorResponse.toObject());
  }
});

module.exports = router;

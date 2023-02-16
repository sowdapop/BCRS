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

saltRounds = 10;

//defines router
const router = express.Router();

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

/**
 * registerUser
 * @openapi
 * /api/session/register:
 *   post:
 *     tags:
 *       - Session
 *     description: API for registering a new user
 *     summary: register new user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - userName
 *               - password
 *               - firstName
 *               - lastName
 *               - phoneNumber
 *               - emailAddress
 *               - address
 *               - securityQuestions
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNumber:
 *                 type: number
 *               emailAddress:
 *                 type: string
 *               address:
 *                 type: string
 *               role:
 *                 type: object
 *                 properties:
 *                   text:
 *                     type: string
 *                     default: "standard"
 *               selectedSecurityQuestions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionText:
 *                       type: string
 *                     answerText:
 *                       type: string
 *     responses:
 *       '200':
 *         description: User document
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post("/register", async (req, res) => {
  try {
    /**
     * query db for user to see if already exists
     */
    User.findOne({ userName: req.body.userName }, function (err, user) {
      /**
       * if there is a mongoDB error
       */
      if (err) {
        console.log(err);
        const findSelectedSecurityQuestionsMongodbErrorResponse =
          new ErrorResponse("501", "MongoDB server error", err);
        res
          .status(501)
          .send(findSelectedSecurityQuestionsMongodbErrorResponse.toObject());
      } else {
        /**
         * if no user if found, ie: username doesn't exist create user
         */
        if (!user) {
          // hash the password
          let hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
          // set the role to standard
          standardRole = {
            text: "standard",
          };
          // user object
          let registeredUser = {
            userName: req.body.userName,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            emailAddress: req.body.emailAddress,
            address: req.body.address,
            role: standardRole,
            selectedSecurityQuestions: req.body.selectedSecurityQuestions,
          };
          // create the new user
          User.create(registeredUser, function (err, newUser) {
            /**
             * if there is a mongoDB error
             */
            if (err) {
              console.log(err);
              const findSelectedSecurityQuestionsMongodbErrorResponse =
                new ErrorResponse("501", "MongoDB server error", err);
              res
                .status(501)
                .send(
                  findSelectedSecurityQuestionsMongodbErrorResponse.toObject()
                );
            } else {
              /**
               * register new user success!!
               */
              console.log(newUser);
              const registeredUserResponse = new BaseResponse(
                "200",
                "User registered",
                newUser
              );
              res.json(registeredUserResponse.toObject());
            }
          });
        } else {
          /**
           * userName already exists
           */
          console.log(`Username ${req.body.userName} already exists.`);
          const userInUseError = new ErrorResponse(
            "400",
            "Username already in use",
            req.body.userName
          );
          res.status(400).send(userInUseError.toObject());
        }
      }
    });
  } catch (error) {
    /**
     * handle an internal server error
     */
    console.log(error);
    const findSelectedSecurityQuestionsCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal server error",
      error
    );
    res
      .status(500)
      .send(findSelectedSecurityQuestionsCatchErrorResponse.toObject());
  }
});

/**
 * verifyUser
 * @openapi
 * /api/session/verify/users/{userName}:
 *   get:
 *     tags:
 *       - Session
 *     description: API for verifying user exists
 *     summary: verify user is in db
 *     parameters:
 *       - in: path
 *         name: userName
 *         schema:
 *           type: string
 *           description: userName to search
 *     responses:
 *       '200':
 *         description: User exists
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/verify/users/:userName", async (req, res) => {
  try {
    /**
     * query db for the user
     */
    User.findOne({ userName: req.params.userName }, function (err, user) {
      /**
       * if there is a mongoDB error
       */
      if (err) {
        console.log(err);
        const findSelectedSecurityQuestionsMongodbErrorResponse =
          new ErrorResponse("501", "MongoDB server error", err);
        res
          .status(501)
          .send(findSelectedSecurityQuestionsMongodbErrorResponse.toObject());
      } else {
        /**
         * no db issues, handle if user is found or not
         */
        if (user) {
          /**
           * user found
           */
          console.log(user);
          const verifyUserResponse = new BaseResponse(
            "200",
            "Query successful",
            user
          );
          res.json(verifyUserResponse.toObject());
        } else {
          /**
           * user not found
           */
          const invalidUsernameResponse = new BaseResponse(
            "400",
            "Invalid username",
            req.params.userName
          );
          res.status(400).send(invalidUsernameResponse.toObject());
        }
      }
    });
  } catch (error) {
    /**
     * handle an internal server error
     */
    console.log(error);
    const findSelectedSecurityQuestionsCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal server error",
      error
    );
    res
      .status(500)
      .send(findSelectedSecurityQuestionsCatchErrorResponse.toObject());
  }
});

module.exports = router;

/**
 * Title:  user-api.js
 * Author: Danial Purselley, William Watlington
 * Date: 7 Feb 2023
 * Description: user API
 *   for BCRS database
 */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const ErrorResponse = require("../services/error-response");
const BaseResponse = require("../services/base-response");

const User = require("../models/user");

saltRounds = 10;

/**
 * findAll
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     description: API for returning list of users
 *     summary: return full Users list
 *     responses:
 *       '200':
 *         description: List of user docs
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/", async (req, res) => {
  try {
    /**
     * Query MongoDB for list of all users
     */
    User.find({})
      .where("isDisabled")
      .equals(false)
      .exec(function (err, user) {
        /**
         * If there is an error with MongoDB
         */
        if (err) {
          console.log(err);
          res.status(501).send({
            err: "MongoDB server error: " + err.message,
          });
        } else {
          /**
           * Successfully return all users
           */
          res.json(user);
          console.log(user);
        }
      });
  } catch (error) {
    /**
     * Catch errors that might happen with our server
     */
    console.log(error);
    res.status(500).send({
      err: "Internal server error: " + error.message,
    });
  }
});

/**
 * findById
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     description: API for finding user by ID.
 *     summary: Finds and returns user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: id of user document
 *     responses:
 *       '200':
 *         description: List of user docs
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/:id", async (req, res) => {
  try {
    //Find the user information for a given user ID
    User.findOne({ _id: req.params.id }, function (err, user) {
      //If there is a database error, return the 501 error message
      if (err) {
        console.log(err);
        res.status(501).send({
          err: "MongoDB Server Error: " + err.message,
        });
        //If there is no error, return the information for the user ID
      } else {
        console.log(user);
        //Returns data as JSON
        res.json(user);
      }
    });
    //If there are server errors, return the 500 error message
  } catch (error) {
    console.log(error);
    res.status(500).send({
      err: "Internal Server Error: " + error.message,
    });
  }
});

/**
 * createUser
 * @openapi
 * /api/users:
 *  post:
 *    tags:
 *      - Users
 *    description: Creates new user
 *    summary: Creates new user
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - userName
 *              - password
 *              - firstName
 *              - lastName
 *              - phoneNumber
 *              - emailAddress
 *              - address
 *              - securityQuestions
 *            properties:
 *              userName:
 *                type: string
 *              password:
 *                type: string
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *              phoneNumber:
 *                type: number
 *              emailAddress:
 *                type: string
 *              address:
 *                type: string
 *              role:
 *                type: object
 *                properties:
 *                  text:
 *                    type: string
 *                    default: "standard"
 *              selectedSecurityQuestions:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    questionText:
 *                      type: string
 *                    answerText:
 *                      type: string
 *    responses:
 *      '200':
 *        description: User document
 *      '500':
 *        description: Server Exception
 *      '501':
 *        description: MongoDB Exception
 *
 */
router.post("/", async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds); // hash password

    // assign request data to newUser object
    let newUser = {
      userName: req.body.userName,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      emailAddress: req.body.emailAddress,
      address: req.body.address,
      role: req.body.role,
      selectedSecurityQuestions: req.body.selectedSecurityQuestions,
    };

    // create new user in database using newUser object
    User.create(newUser, function (err, user) {
      if (err) {
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        res.json(user);
      }
    });
  } catch (error) {
    res.status(500).send({
      err: "Internal Server Error: " + error.message,
    });
  }
});

/**
 * updateUser
 * @openapi
 * /api/users/{id}:
 *  put:
 *    tags:
 *      - Users
 *    description: Updates existing user
 *    summary: Updates existing user
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          description: id to update
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            properties:
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *              phoneNumber:
 *                type: number
 *              emailAddress:
 *                type: string
 *              address:
 *                type: string
 *              role:
 *                type: string
 *    responses:
 *      '200':
 *        description: User document
 *      '500':
 *        description: Server Exception
 *      '501':
 *        description: MongoDB Exception
 */
router.put("/:id", async (req, res) => {
  // get user by id, update fields using request body
  try {
    User.findOne({ _id: req.params.id }, function (err, user) {
      if (err) {
        //  if there is an error during the mondoDB query
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        //  no errors, set the new user details
        user.set({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          emailAddress: req.body.emailAddress,
          address: req.body.address,
          "role.text": req.body.role,
          dateModified: Date.now(),
        });
        //  save the user to the db
        user.save(function (err, savedUser) {
          if (err) {
            //  if there is an error while saving the user
            console.log(err);
            res.status(501).send({
              message: `MongoDB Exception: ${err}`,
            });
          } else {
            //  no errors, user saved!!!
            console.log(savedUser);
            const savedUserResponse = new BaseResponse(
              "200",
              "User updated",
              savedUser
            );
            res.json(savedUserResponse.toObject());
          }
        });
      }
    });
  } catch (error) {
    //  if there is a server error
    res.status(500).send({
      err: "Internal Server Error: " + error.message,
    });
  }
});

/**
 * deleteUser
 * @openapi
 * /api/users/{id}:
 *  delete:
 *    tags:
 *      - Users
 *    description: Sets existing user to disabled
 *    summary: Sets existing user to disabled
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          description: id to update
 *    responses:
 *      '200':
 *        description: User document
 *      '500':
 *        description: Server Exception
 *      '501':
 *        description: MongoDB Exception
 *
 */
router.delete("/:id", async (req, res) => {
  try {
    // finds user by id, then sets "isDisabled" to true
    User.findOne({ _id: req.params.id }, function (err, user) {
      if (err) {
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        if (user) {
          user.set({
            isDisabled: true,
          });
          user.save(function (err, updatedUser) {
            if (err) {
              console.log(err);
              res.status(501).send({
                message: `MongoDB Exception: ${err}`,
              });
            } else {
              res.json(updatedUser);
            }
          });
        } else {
          res.status(401).send({
            message: "ID: " + req.params.id + " does not exist",
          });
        }
      }
    });
  } catch (error) {
    res.status(500).send({
      err: "Internal Server Error: " + error.message,
    });
  }
});

/**
 * findSelectedSecurityQuestions
 * @openapi
 * /api/users/{userName}/security-questions:
 *   get:
 *     tags:
 *       - Users
 *     description: API for returning a users selected security questions
 *     summary: return security questions
 *     parameters:
 *       - in: path
 *         name: userName
 *         schema:
 *           type: string
 *           description: userName to search
 *     responses:
 *       '200':
 *         description: User's security questions
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/:userName/security-questions", async (req, res) => {
  try {
    /**
     * query the db to find the user
     */
    User.findOne({ userName: req.params.userName }, function (err, user) {
      /**
       * if there is a mongo db error during query
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
         * user found
         */
        console.log(user);
        /**
         * set the response data to just be the selectedSecurityQuestions
         */
        const findSelectedSecurityQuestionsResponse = new BaseResponse(
          "200",
          "Query Successful",
          user.selectedSecurityQuestions
        );
        res.json(findSelectedSecurityQuestionsResponse.toObject());
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
 * findUserRole
 * @openapi
 * /api/users/{userName}/role:
 *   get:
 *     tags:
 *       - Users
 *     description: API for finding user role
 *     summary: return a user
 *     parameters:
 *       - in: path
 *         name: userName
 *         schema:
 *           type: string
 *           description: userName
 *     responses:
 *       '200':
 *         description: User found
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB exception
 */
router.get("/:userName/role", async (req, res) => {
  try {
    //  query the db with the username
    User.findOne({ userName: req.params.userName }, function (err, user) {
      if (err) {
        //  handle mongoDB query errors
        console.log(err);
        const findUserRoleMongoDBErrorResponse = new ErrorResponse(
          "501",
          "MongoDB server error",
          err
        );
        res.status(501).send(findUserRoleMongoDBErrorResponse);
      } else {
        //  no errors, return found user!!!
        console.log(user);
        const findUserRoleResponse = new BaseResponse(
          "200",
          "User roles",
          user
        );
        res.json(findUserRoleResponse.toObject());
      }
    });
  } catch (error) {
    //  if there is a server error
    console.log(error);
    const findUserRoleCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal Server Error",
      error.message
    );
    res.status(500).send(findUserRoleCatchErrorResponse.toObject());
  }
});

module.exports = router;

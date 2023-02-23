/**
 * Title:  role-api.js
 * Author: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 7 Feb 2023
 * Description: api routes for roles
 */

const express = require("express");
// import the models
const Role = require("../models/role");
const User = require("../models/user");
// import our response objects
const ErrorResponse = require("../services/error-response");
const BaseResponse = require("../services/base-response");
const { Router } = require("express");
// express router
const router = express.Router();

/**
 * createRole
 * @openapi
 * /api/roles:
 *   post:
 *     tags:
 *       - Roles
 *     description: API for creating a user role
 *     summary: create a new role
 *     requestBody:
 *       description: role name
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 default: new role here
 *               isDisabled:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       '200':
 *         description: Role Created
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post("/", async (req, res) => {
  try {
    //  start with a database query to find existing role
    Role.findOne({ text: req.body.text }, function (err, role) {
      if (err) {
        //  if there is a mongoDB error during the query
        console.log(err);
        const findRoleMongoDBErrorResponse = new ErrorResponse(
          "501",
          "MongoDB Server Error",
          err
        );
        res.status(500).send(findRoleMongoDBErrorResponse.toObject());
      } else {
        //  no query error, now see if the role exists or not
        if (!role) {
          //  role doesn't exist, assign a variable with the bodies text
          const newRole = {
            text: req.body.text,
          };
          //  use a mongoose create to add the variable to the db, via the Role model
          Role.create(newRole, function (err, role) {
            if (err) {
              //  if there is a mongoDB error during the create
              console.log(err);
              const createRoleMongoDBErrorResponse = new ErrorResponse(
                "501",
                "MongoDB Server Error",
                err
              );
              res.status(500).send(createRoleMongoDBErrorResponse.toObject());
            } else {
              //  no errors, role created!!
              console.log(role);
              const createRoleResponse = new BaseResponse(
                "200",
                "Role Created!",
                role
              );
              res.json(createRoleResponse.toObject());
            }
          }); //end create
        } else {
          //  role already exists in the db
          console.log(`Role: ${req.body.text} already exists in the DB.`);
          const roleAlreadyExistsResponse = new ErrorResponse(
            "200",
            "That role already exists. If you do not see the role in the list then it has been disabled!"
          );
          res.json(roleAlreadyExistsResponse.toObject());
        } //end else
      } //end else
    }); //end findOne
  } catch (error) {
    //  if there is a server error
    console.log(error);
    const createRoleCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal Server Error",
      error.message
    );
    res.status(500).send(createRoleCatchErrorResponse.toObject());
  }
});

/**
 * findAllRoles
 */
router.get("/", async (req, res) => {
  try {
    //  query the db for enabled roles
    Role.find({})
      .where("isDisabled")
      .equals(false)
      .exec(function (err, roles) {
        if (err) {
          //  if there is a mongoDB error during the query
          console.log(err);
          const findAllRolesMongoDBErrorResponse = new ErrorResponse(
            "501",
            "MongoDB Server Error",
            err
          );
          res.status(500).send(findAllRolesMongoDBErrorResponse.toObject());
        } else {
          //  no query error, Roles returned!!
          console.log(roles);
          const findAllRolesResponse = new BaseResponse(
            "200",
            "Query successful",
            roles
          );
          res.json(findAllRolesResponse.toObject());
        }
      });
  } catch (error) {
    //  if there is a server error
    console.log(error);
    const createRoleCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal Server Error",
      error.message
    );
    res.status(500).send(createRoleCatchErrorResponse.toObject());
  }
});

module.exports = router;

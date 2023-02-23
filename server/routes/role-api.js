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
 * @openapi
 * /api/roles:
 *   get:
 *     tags:
 *       - Roles
 *     description: API for show list of all roles
 *     summary: return all roles in collection
 *     responses:
 *       '200':
 *         description: List of roles
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
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
    const findAllRolesCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal Server Error",
      error.message
    );
    res.status(500).send(findAllRolesCatchErrorResponse.toObject());
  }
});

/**
 * findRoleById
 * @openapi
 * /api/roles/{roleId}:
 *   get:
 *     tags:
 *       - Roles
 *     description: API for showing one role
 *     summary: return role by id
 *     parameters:
 *       - in: path
 *         name: roleId
 *         schema:
 *           type: string
 *           description: roleId
 *     responses:
 *       '200':
 *         description: Found Role
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/:roleId", async (req, res) => {
  try {
    //  query the database with the parameters
    Role.findOne({ _id: req.params.roleId }, function (err, role) {
      if (err) {
        //  if there is a mongoDB error during the query
        console.log(err);
        const findRoleByIdMongoDBErrorResponse = new ErrorResponse(
          "501",
          "MongoDB Server Error",
          err
        );
        res.status(500).send(findRoleByIdMongoDBErrorResponse.toObject());
      } else {
        // if no errors, return the role
        console.log(role);
        const findRoleByIdResponse = new BaseResponse(
          "200",
          "Query successful",
          role
        );
        res.json(findRoleByIdResponse.toObject());
      }
    });
  } catch (error) {
    //  if there is a server error
    console.log(error);
    const findRoleByIdCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal Server Error",
      error.message
    );
    res.status(500).send(findRoleByIdCatchErrorResponse.toObject());
  }
});

/**
 * updateRole
 * @openapi
 * /api/roles/{roleId}:
 *   put:
 *     tags:
 *       - Roles
 *     description: API for updating a role
 *     summary: update role by ID
 *     parameters:
 *       - in: path
 *         name: roleId
 *         schema:
 *           type: string
 *           description: roleId to update
 *     requestBody:
 *       description: new role name
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 default: updated role name
 *     responses:
 *       '200':
 *         description: Updated Role
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.put("/:roleId", async (req, res) => {
  try {
    //  query the db for the id
    Role.findOne({ _id: req.params.roleId }, function (err, role) {
      if (err) {
        //  if there is a mongoDB error during the query
        console.log(err);
        const updateRoleMongoDBErrorResponse = new ErrorResponse(
          "501",
          "MongoDB Server Error",
          err
        );
        res.status(500).send(updateRoleMongoDBErrorResponse.toObject());
      } else {
        //  if no errors set the new role
        role.set({
          text: req.body.text,
        });
        //  after set, save the role
        role.save(function (err, updatedRole) {
          if (err) {
            //  if there is a mongoDB error during the save
            console.log(err);
            const updatedRoleMongoDBErrorResponse = new ErrorResponse(
              "501",
              "MongoDB Server Error",
              err
            );
            res.status(500).send(updatedRoleMongoDBErrorResponse.toObject());
          } else {
            //  no errors during save, role updated!!!
            console.log(updatedRole);
            const updatedRoleResponse = new BaseResponse(
              "200",
              "Role Updated",
              updatedRole
            );
            res.json(updatedRoleResponse.toObject());
          }
        });
      }
    });
  } catch (error) {
    //  if there is a server error
    console.log(error);
    const updateRoleCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal Server Error",
      error.message
    );
    res.status(500).send(updateRoleCatchErrorResponse.toObject());
  }
});

/**
 * deleteRole
 */
router.delete("/:roleId", async (req, res) => {
  try {
    //  query the db for the role
    Role.findOne({ _id: req.params.roleId }, function (err, role) {
      if (err) {
        //  if there is a mongoDB error during the query
        console.log(err);
        const deleteRoleMongoDBErrorResponse = new ErrorResponse(
          "501",
          "MongoDB Server Error",
          err
        );
        res.status(500).send(deleteRoleMongoDBErrorResponse.toObject());
      } else {
        //  no error during the query
        //  aggregate query to see if role is tied to users
        //  !!NOTICE!! aggregate is in the "User" model not the "Role" model
        User.aggregate(
          //  aggregate takes an array of command objects
          [
            {
              $lookup: {
                from: "roles",
                localField: "role.text",
                foreignField: "text",
                as: "userRoles",
              },
            },
            {
              $match: {
                "userRoles.text": role.text,
              },
            },
          ], //end aggregate array
          function (err, users) {
            if (err) {
              //  if there is an error with the aggregate
              console.log(err);
              const usersMongoDBErrorResponse = new ErrorResponse(
                "501",
                "MongoDB server error",
                err
              );
              res.status(500).send(usersMongoDBErrorResponse.toObject());
            } else {
              //  no error during aggregate
              if (users.length > 0) {
                //  role is already used by users, don't disable it
                console.log(
                  `Role <${role.text}> is in use. It cannot be deleted`
                );
                const userRoleAlreadyInUseResponse = new BaseResponse(
                  "400",
                  "Role is in use",
                  role
                );
                res.status(400).send(userRoleAlreadyInUseResponse.toObject());
              }
              //
              //
              //
              //
              //
              //
              //
            }
          }
        );
      }
    });
  } catch (error) {
    //  if there is a server error
    console.log(error);
    const deleteRoleCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal Server Error",
      error.message
    );
    res.status(500).send(deleteRoleCatchErrorResponse.toObject());
  }
});

module.exports = router;

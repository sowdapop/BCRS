/**
 * Title:  user-api.js
 * Author: Danial Purselley
 * Date: 7 Feb 2023
 * Description: user API
 *   for BCRS database
 */

const express = require("express");
const router = express.Router();

const User = require("../models/user");

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
    User.find({}, function (err, user) {
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
 * findUserById
 */

/**
 * createUser
 */
router.post("/", async (req, res) => {
  try {
  } catch (error) {}
});

/**
 * updateUser
 */

// ((soft delete))

/**
 * deleteUser
 */

module.exports = router;

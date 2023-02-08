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
 * findAll
 * @openapi
 * /api/users/:userId:
 *   get:
 *     tags:
 *       - Users
 *     description: API for finding user by ID.
 *     summary: Finds and returns user by ID
 *     responses:
 *       '200':
 *         description: List of user docs
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

router.get('/:userId', async (req, res) => {
  try
    {
      //Find the user information for a given user ID
      User.findOne({'userId': req.params.userId}, function(err, user) {
        //If there is a database error, return the 501 error message
        if (err)  
        {
          console.log(err);
            res.status(501).send({
              'err': 'MongoDB Server Error: ' + err.message
          })
          //If there is no error, return the information for the user ID
        } else {
          console.log(user);
          //Returns data as JSON
          res.json(user);
        }
      })
      //If there are server errors, return the 500 error message
    } catch (e) 
      {
        console.log(err);
          res.status(500).send({
            'err': 'Internal Server Error: ' + error.message
      })
    }
})

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

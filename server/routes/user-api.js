/**
 * Title:  user-api.js
 * Author: Danial Purselley, William Watlington
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
      'err' : "Internal server error: " + error.message,
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
    } catch (error) 
      {
        console.log(error);
          res.status(500).send({
            'err': 'Internal Server Error: ' + error.message
      })
    }
})

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
 *              - firstName
 *              - lastName
 *              - phoneNumber
 *              - emailAddress
 *              - address
 *              - securityQuestions
 *            properties:
 *              userName:
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
 *              securityQuestions: 
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    questionText:
 *                      type: string
 *                    questionAnswer:
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
    let newUser = {
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      emailAddress: req.body.emailAddress,
      address: req.body.address,
      securityQuestions: req.body.securityQuestions
    };
    User.create(newUser, function(err, user) {
      if(err) {
        res.status(501).send({
            "message": `MongoDB Exception: ${err}`
        });
    } else {
      res.json(user);
    }
    })
  } catch (error) {
    res.status(500).send({
      'err': 'Internal Server Error: ' + error.message
    });
  }
});

/**
 * updateUser
 */

// ((soft delete))

/**
 * deleteUser
 */

module.exports = router;

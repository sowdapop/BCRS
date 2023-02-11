/**
 * Title:  Bob's Computer Repair Shop
 * Authors: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 11 Feb 2023
 * Description: A web application for a computer repair shop
 */


const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const BaseResponse = require("../models/base-response");
const ErrorResponse = require("../models/error-response");
const { async } = require("rxjs");
const { model } = require("mongoose");

//defines router
const router = express.Router();

//Swagger for user sign in
/**
openapi: 3.0.0
info:
  title: bcrs API
  version: '1.0'
servers:
  - url: https://localhost:3000/
    description: Main (production) server
paths:
  /api/session/login:
    post:
      summary: Logs in user
      description: >
        Reads user input and compares against DB. Logs in if correct, returns
        error if incorrect.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              required:
                - username
                - password
      responses:
        '200':
          description: Log In successful
          content:
            application/json:
              schema:
                type: string
        '500':
          description: Server exceptions
          content:
            application/json:
              schema:
                type: string
        '501':
          description: MongoDB exceptions
          content:
            application/json:
              schema:
                type: string
 */


//user sign in
router.post('/login', async(req, res) => {
    try {
        //find the username
        User.findOne({'userName': req.body.userName}, function (err, user)
        {
            if (err)
            {
                console.log(err);
                const signinMongoDbErrorResponse = new ErrorResponse(500, 'Internal Server Error', err);
                res.status(500).send(signinMongoDbErrorResponse.toObject());
            }
            else 
            {
                console.log(user);

            //if the username is valid, compare the password entered with the hashed one
            if (user) 
             {
                let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

            //if the password is valid, log in
            if (passwordIsValid)
            {
                console.log('Log-in successful');
                const signinResponse = new BaseResponse(200, 'Log-In successful', user);
                res.json(signinResponse.toObject());

            } else 
                {
            //if the password is invalid, handle the error
                console.log(`Invalid password for username: ${user.userName}`);
                const invalidPasswordResponse = new BaseResponse(401, 'Invalid username and/or password. Please try again', null);
                res.status(401).send(invalidPasswordResponse.toObject());
                 }
                }
            }
        }
    )}
catch(e)
{
    console.log(e);
    const signinCatchErrorResponse = new ErrorResponse(500, 'Internal Server Error', e.message);
    res.status(500).send(signinCatchErrorResponse.toObject());
}
});

module.exports = router;
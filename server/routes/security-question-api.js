/**
 * Title:  security-question-api.js
 * Author: Danial Purselley, William Watlington
 * Date: 7 Feb 2023
 * Description: SQ API
 *   for BCRS database
 */

const express = require("express");
const router = express.Router();

const SecurityQuestion = require("../models/security-question");

/**
 * createSecurityQuestion
 * @openapi
 * /api/security-questions:
 *   post:
 *     tags:
 *       - Security Questions
 *     description: API for creating security questions
 *     summary: create a new security question document
 *     requestBody:
 *       description: security question fields
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - questionText
 *             properties:
 *               questionText:
 *                 type: string
 *               isDisabled:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       '200':
 *         description: Created Security Question
 *       '401':
 *         description: Question already exists
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post("/", async (req, res) => {
  try {
    /**
     * variable assignment for new questions
     */
    let questionText = req.body.questionText;
    let isDisabled = false;

    /**
     * build a new question object with req.body values
     */
    const newSecurityQuestion = {
      questionText: questionText,
      isDisabled: isDisabled,
    };

    /**
     * query the sec question collection to see if current question exists
     */
    SecurityQuestion.findOne(
      { questionText: questionText },
      function (err, question) {
        if (!question) {
          SecurityQuestion.create(
            newSecurityQuestion,
            function (err, newQuestion) {
              /**
               * handle mongo err while create question
               */
              if (err) {
                console.log(err);
                res.status(501).send({
                  err: "MongoDB server error: " + err.message,
                });
              } else {
                /**
                 * successful creation
                 */
                console.log(newQuestion);
                res.json(newQuestion);
              }
            }
          );
        } else {
          /**
           * if security question already exists
           */
          console.log("Security Question already exists!");
          res.status(401).send({
            err: "Security Question already exists!",
          });
        }
      }
    );
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
 * /api/security-questions:
 *   get:
 *     tags:
 *       - Security Questions
 *     description: API for showing list of questions
 *     summary: return all questions in collection
 *     responses:
 *       '200':
 *         description: List of questions
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/", async (req, res) => {
  try {
    SecurityQuestion.find({}, function (err, questions) {
      /**
       * handle mongo err for the query
       */
      if (err) {
        console.log(err);
        res.status(501).send({
          err: "MongoDB server error: " + err.message,
        });
      } else {
        /**
         * successful get, list of questions
         */
        console.log(questions);
        res.json(questions);
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
 * /api/security-questions/{id}:
 *   get:
 *     tags:
 *       - Security Questions
 *     description: API for showing one specific question
 *     summary: return question by ID
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          description: id to update
 *     responses:
 *       '200':
 *         description: Found question
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/:id", async (req, res) => {
  try {
    //Find the question for a given question ID
    SecurityQuestion.findOne({ _id: req.params.id }, function (err, question) {
      //If there is a database error, return the 501 error message
      if (err) {
        console.log(err);
        res.status(501).send({
          err: "MongoDB Server Error: " + err.message,
        });
        //If there is no error, return the questions for the user ID
      } else {
        console.log(question);
        //Returns data as JSON
        res.json(question);
      }
    });
    //If there are server errors, return the 500 error message
  } catch (e) {
    console.log(err);
    res.status(500).send({
      err: "Internal Server Error: " + error.message,
    });
  }
});

/**
 * updateSecurityQuestion
 * @openapi
 * /api/security-questions/{id}:
 *   put:
 *     tags:
 *       - Security Questions
 *     description: API for updated a specific question
 *     summary: update question by ID
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          description: id to update
 *     requestBody:
 *       description: security question fields
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - questionText
 *             properties:
 *               questionText:
 *                 type: string
 *               isDisabled:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       '200':
 *         description: Question updated
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.put("/:id", async (req, res) => {
  try {
    SecurityQuestion.findOne({ _id: req.params.id }, function (err, question) {
      if (err) {
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        if (question) {
          question.set({
            questionText: req.body.questionText,
          });
          question.save(function (err, updatedQuestion) {
            if (err) {
              console.log(err);
              res.status(501).send({
                message: `MongoDB Exception: ${err}`,
              });
            } else {
              res.json(updatedQuestion);
            }
          });
        } else {
          res.status(401).send({
            message: "Question ID: " + req.params.id + " not found",
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
 * deleteSecurityQuestion
 * @openapi
 * /api/security-questions/{id}:
 *   delete:
 *     tags:
 *       - Security Questions
 *     description: API for deleting a specific question
 *     summary: soft delete security question
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           description: id to update
 *     responses:
 *       '200':
 *         description: Question "deleted"
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.delete("/:id", async (req, res) => {
  try {
    /**
     * Start the DB query by looking up the specific security question
     */
    SecurityQuestion.findOne({ _id: req.params.id }, function (err, question) {
      /**
       * Handle DB error if question is not found
       */
      if (err) {
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        /**
         * Question found, update isDisabled field to soft delete
         */
        question.set({
          isDisabled: true,
        });
        /**
         * Save the updated question
         */
        question.save(function (err, deletedQuestion) {
          /**
           * If mongoDB has an err saving the document
           */
          if (err) {
            console.log(err);
            res.status(501).send({
              message: `MongoDB Exception: ${err}`,
            });
          } else {
            /**
             * No errors, document is saved as 'isDisabled = true'
             */
            console.log('Question "deleted": ' + deletedQuestion);
            res.json(deletedQuestion);
          }
        });
      }
    });
  } catch (error) {
    /**
     * Handle server error
     */
    res.status(500).send({
      err: "Internal Server Error: " + error.message,
    });
  }
});
module.exports = router;

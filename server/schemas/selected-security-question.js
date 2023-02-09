/**
 * Title:  selected-security-question.js
 * Author: Danial Purselley, William Watlington
 * Date: 7 Feb 2023
 * Description: sq schema
 *   for BCRS database
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Set the exportable schema for selecting security questions
 */
let selectedSecurityQuestionSchema = new Schema({
  questionText: { type: String },
  answerText: { type: String },
});

module.exports = selectedSecurityQuestionSchema;

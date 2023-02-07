/**
 * Title:  security-question.js
 * Author: Danial Purselley
 * Date: 7 Feb 2023
 * Description: security question model
 *   for BCRS database
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let selectedSecurityQuestionSchema = new Schema({
  questionText: { type: String },
  answerText: { type: String },
  isDisabled: { type: Boolean, default: false },
});

module.exports = mongoose.model(
  "SecurityQuestion",
  selectedSecurityQuestionSchema
);

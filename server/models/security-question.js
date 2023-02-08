/**
 * Title:  security-question.js
 * Author: Danial Purselley, William Watlington
 * Date: 7 Feb 2023
 * Description: security question model
 *   for BCRS database
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let securityQuestionSchema = new Schema({
  questionText: { type: String },
  isDisabled: { type: Boolean, default: false },
});

module.exports = mongoose.model(
  "SecurityQuestion",
  securityQuestionSchema
);

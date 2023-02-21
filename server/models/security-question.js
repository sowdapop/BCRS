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
 * Set the exportable schema for making security questions
 */
let securityQuestionSchema = new Schema(
  {
    text: { type: String },
    isDisabled: { type: Boolean, default: false },
  },
  { collection: "securityquestions" } // write to the existing collection
);

module.exports = mongoose.model("SecurityQuestion", securityQuestionSchema);

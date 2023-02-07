/**
 * Title:  user.js
 * Author: Danial Purselley
 * Date: 7 Feb 2023
 * Description: user model
 *   for BCRS database
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const selectedSecurityQuestionSchema = require("./security-question");

let userSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
});

module.exports = mongoose.model("Users", userSchema);

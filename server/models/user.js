/**
 * Title:  user.js
 * Author: Danial Purselley, William Watlington
 * Date: 7 Feb 2023
 * Description: user model
 *   for BCRS database
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let selectedSecurityQuestionSchema = new Schema({
  questionText: { type: String, required: true },
  questionAnswer: { type: String, required: true}
})

let userSchema = new Schema({
  userName: { type: String, unique: true, required: true },
  firstName: { type: String },
  lastName: { type: String },
  phoneNumber: { type: String },
  emailAddress: { type: String },
  address: {type: String },
  //Will need to change this when 'role' schema is made
  userRole: { type: String, default: "standard" },
  securityQuestions: [selectedSecurityQuestionSchema],
  dateCreated: { type: Date, default: Date.now() },
  dateModified: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Users", userSchema);

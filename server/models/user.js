/**
 * Title:  user.js
 * Author: Danial Purselley, William Watlington
 * Date: 7 Feb 2023
 * Description: user model
 *   for BCRS database
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserRoleSchema = require("../schemas/user-role");
const SelectedSecurityQuestionSchema = require("../schemas/selected-security-question");

/**
 * Set a user schema when creating new users
 */
let userSchema = new Schema(
  {
    userName: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    emailAddress: { type: String },
    address: { type: String },
    userRole: UserRoleSchema,
    selectedSecurityQuestions: [SelectedSecurityQuestionSchema],
    dateCreated: { type: Date, default: Date.now() },
    dateModified: { type: Date, default: Date.now() },
    isDisabled: { type: Boolean, default: false },
  },
  { collection: "users" } // write documents to existing collection
);

module.exports = mongoose.model("Users", userSchema);

/**
 * Title:  user-role.js
 * Author: Danial Purselley, William Watlington
 * Date: 7 Feb 2023
 * Description: user role schema
 *   for BCRS database
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Set a schema for the user's role
 */
let userRoleSchema = new Schema({
  text: { type: String, default: "standard" },
});

module.exports = userRoleSchema;

/**
 * Title:  role.js
 * Author: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 23 Feb 2023
 * Description: role model
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  text: { type: String, unique: true },
  isDisabled: { type: Boolean, default: false },
});

module.exports = mongoose.model("Role", roleSchema);

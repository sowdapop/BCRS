/**
 * Title:  line-item.js
 * Author: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 24 Feb 2023
 * Description: line item schema
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lineItemSchema = new Schema({
  title: { type: String },
  price: { type: Number },
});

module.exports = lineItemSchema;

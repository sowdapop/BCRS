/**
 * Title:  invoice.js
 * Author: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 23 Feb 2023
 * Description: invoice model
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lineItemDocument = require("../schemas/line-item");

const invoiceSchema = new Schema({
  userName: { type: String },
  lineItems: [lineItemDocument],
  partsAmount: { type: Number },
  laborAmount: { type: Number },
  lineItemTotal: { type: Number },
  total: { type: Number },
  orderDate: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Invoice", invoiceSchema);

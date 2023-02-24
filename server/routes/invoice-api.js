/**
 * Title:  invoice-api.js
 * Author: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 7 Feb 2023
 * Description: api routes for invoices
 */

const express = require("express");

const Invoice = require("../models/invoice");

const ErrorResponse = require("../services/error-response");
const BaseResponse = require("../services/base-response");

const router = express.Router();

/**
 * createInvoice
 * @openapi
 * /api/invoices/{userName}:
 *   post:
 *     tags:
 *       - Invoices
 *     description: API for creating a new invoice
 *     summary: create a new invoice
 *     parameters:
 *       - in: path
 *         name: userName
 *         schema:
 *           type: string
 *           description: userName
 *     requestBody:
 *       description: Invoice details
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               lineItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       default: lineItem Example
 *                     price:
 *                       type: number
 *                       default: 24.99
 *               partsAmount:
 *                 type: number
 *                 default: 99.99
 *               laborAmount:
 *                 type: number
 *                 default: 99.99
 *               lineItemTotal:
 *                 type: number
 *                 default: 99.99
 *               total:
 *                 type: number
 *                 default: 199.99
 *     responses:
 *       '200':
 *         description: Invoice created
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post("/:userName", async (req, res) => {
  try {
    //  set text body to new invoice object
    const newInvoice = {
      userName: req.params.userName,
      lineItems: req.body.lineItems,
      partsAmount: req.body.partsAmount,
      laborAmount: req.body.laborAmount,
      lineItemTotal: req.body.lineItemTotal,
      total: req.body.total,
    };
    //  log invoice to check fields
    console.log(newInvoice);
    //  save the invoice to the db
    Invoice.create(newInvoice, function (err, invoice) {
      if (err) {
        //  if there is a mongoDB error during the creation
        console.log(err);
        const createInvoiceMongoDBErrorResponse = new ErrorResponse(
          "501",
          "MongoDB Server Error",
          err
        );
        res.status(501).send(createInvoiceMongoDBErrorResponse.toObject());
      } else {
        //  no errors, create the invoice!!!
        console.log(invoice);
        const createInvoiceResponse = new BaseResponse(
          "200",
          "Invoice created!",
          invoice
        );
        res.json(createInvoiceResponse.toObject());
      }
    });
  } catch (error) {
    //  if there is a server error
    console.log(error);
    const createInvoiceCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal Server Error",
      error.message
    );
    res.status(500).send(createInvoiceCatchErrorResponse.toObject());
  }
});

/**
 * findPurchasesByService
 * @openapi
 * /api/invoices/purchase-graph:
 *   get:
 *     tags:
 *       - Invoices
 *     description: API for returning aggregate data
 *     summary: return the purchase services
 *     responses:
 *       '200':
 *         description: Query successful
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/purchase-graph", async (req, res) => {
  try {
    //  aggregate services in the invoice collection
    Invoice.aggregate(
      //  array of aggregate commands
      [
        {
          //  unwind will flatten the collection to array
          $unwind: "$lineItems",
        },
        {
          //  group the array items
          $group: {
            _id: {
              title: "$lineItems.title",
              price: "$lineItems.price",
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          //  sort the items
          $sort: {
            "_id.title": 1,
          },
        },
      ],
      //  callback function
      function (err, purchaseGraph) {
        if (err) {
          //  if there is a mongoDB error during the aggregation
          console.log(err);
          const findPurchaseByServiceGraphMongoDBErrorResponse =
            new ErrorResponse("501", "MongoDB Server Error", err);
          res
            .status(501)
            .send(findPurchaseByServiceGraphMongoDBErrorResponse.toObject());
        } else {
          //
          console.log(purchaseGraph);
          const findPurchaseByServiceGraphResponse = new BaseResponse(
            "200",
            "Query successful",
            purchaseGraph
          );
          res.json(findPurchaseByServiceGraphResponse.toObject());
        }
      }
    );
  } catch (error) {
    //  if there is a server error
    console.log(error);
    const purchaseGraphCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal Server Error",
      error.message
    );
    res.status(500).send(purchaseGraphCatchErrorResponse.toObject());
  }
});

module.exports = router;

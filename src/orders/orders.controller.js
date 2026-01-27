const path = require("path");

const valid = require("../errors/validProperty");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

//Method: List
function list(req, res) {
  res.json({ data: orders });
}

//Validate: populated dishes array included
function dishOrder(req, res, next) {
  const { data: { dishes } = {} } = req.body;
  if (!dishes) {
    return next({
      status: 400,
      message: "Order must include a dish",
    });
  }
  if (Array.isArray(dishes) && dishes.length > 0) {
    return next();
  }
  return next({
    status: 400,
    message: "Order must include at least one dish"
  })
}

//Validate: quantity
function quantity(req, res, next) {

}

//Export
module.exports = {
  list,
  create: [valid("deliverTo"), valid("mobileNumber"), dishOrder],
};

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
    message: "Order must include at least one dish",
  });
}

//Validate: dishes have valid quantity
function quantity(req, res, next) {
  const { data: { dishes } = {} } = req.body;
  for (i = 0; i < dishes.length; i++) {
    const dish = dishes[i];
    if (
      !dish.quantity ||
      typeof dish.quantity != "number" ||
      dish.quantity <= 0
    ) {
      return next({
        status: 400,
        message: `dish ${i} must have a quantity that is an integer greater than 0`,
      });
    }
  }
  return next();
}

//Method: Create
function create(req, res) {
  const { data: { deliverTo, mobileNumber, status, dishes } = [] } = req.body;

  newOrder = {
    id: nextId(),
    deliverTo: deliverTo,
    mobileNumber: mobileNumber,
    status: status,
    dishes: dishes,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

//Export
module.exports = {
  list,
  create: [
    valid("deliverTo"),
    valid("mobileNumber"),
    dishOrder,
    quantity,
    create,
  ],
};

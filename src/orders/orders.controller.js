const path = require("path");
const ordersService = require("./orders.service");
//Error handling
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const valid = require("../errors/validProperty");

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");
const { rmSync } = require("fs");

//Method: List
async function list(req, res) {
  const data = await ordersService.list();
  res.json({ data });
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

//Validate: id
function idCheck(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);

  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  }
  return next({
    status: 404,
    message: `${orderId} not found`,
  });
}

//Method: Read
function read(req, res) {
  res.json({ data: res.locals.order });
}

//Validate: req.body.id
function idMatch(req, res, next) {
  const { data: { id } = {} } = req.body;
  const { orderId } = req.params;
  if (id && id != orderId) {
    return next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${id}, Route: ${orderId}`,
    });
  }
  return next();
}

//Validate: status
function status(req, res, next) {
  const { data: { status } = {} } = req.body;
  const validSyntax = ["pending", "preparing", "out-for-delivery", "delivered"];
  if (status && validSyntax.includes(status)) {
    if (status === "delivered") {
      return next({
        status: 400,
        message: "A delivered order cannot be changed",
      });
    }
    return next();
  }
  return next({
    status: 400,
    message:
      "Order must have a status of pending, preparing, out-for-delivery, delivered",
  });
}

//Method: Update
function update(req, res) {
  const { data: { deliverTo, mobileNumber, status, dishes } = [] } = req.body;
  const { orderId } = req.params;

  const uOrder = res.locals.order;
  const i = orders.findIndex((order) => order.id === orderId);

  //Updating order
  uOrder.deliverTo = deliverTo;
  uOrder.mobileNumber = mobileNumber;
  uOrder.status = status;
  uOrder.dishes = dishes;

  //Updating order array
  orders.splice(i, 1, uOrder);
  res.json({ data: uOrder });
}

//Method: Destroy
function destroy(req, res, next) {
  const status = res.locals.order.status;
  const { orderId } = req.params;
  const i = orders.find((order) => order.id === orderId);
  if (status === "pending") {
    //Removing order
    const removedOrder = orders.splice(i, 1);
    res.status(204).json({ data: removedOrder });
  }
  return next({
    status: 400,
    message: "An order cannot be deleted unless it is pending.",
  });
}

//Export
module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    valid("deliverTo"),
    valid("mobileNumber"),
    dishOrder,
    quantity,
    create,
  ],
  read: [idCheck, read],
  update: [
    idCheck,
    idMatch,
    valid("deliverTo"),
    valid("mobileNumber"),
    dishOrder,
    quantity,
    status,
    update,
  ],
  delete: [idCheck, destroy],
};

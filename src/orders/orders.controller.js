const path = require("path");
const ordersService = require("./orders.service");

//Error handling
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

const VALID_PROPERTIES = [
  "id",
  "deliverTo",
  "mobileNumber",
  "status",
  "dishes",
];

//Validate Req.Body
const hasRequiredProperties = hasProperties(
  "deliverTo",
  "mobileNumber",
  "dishes",
);
function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field),
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");
const { rmSync } = require("fs");

//Use this function to add entries to dishes_orders
async function updateDishesOrdersTable(req, res) {
  const { dishes } = res.locals.order.dishes;
  for (i = 0; i < dishes; i++) {
    res.locals.dish = dishes[i];
    await ordersService.updateDishesOrdersTable();
  }
}

//Method: List
async function list(req, res) {
  const data = await ordersService.list();
  res.json({ data });
}

//Validate: populated dishes array included
function isValidDishOrder(req, res, next) {
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
function isValidQuantity(req, res, next) {
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
async function create(req, res) {
  const data = ordersService.create(req.body);
  res.status(201).json({ data });
}

//Validate: id
async function orderExists(req, res, next) {
  const foundOrder = await ordersService.checkOrderId(req.params.orderId);
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
function idMatches(req, res, next) {
  const { data: { id } = {} } = req.body;
  const { orderId } = req.params;
  if (id) {
    if (id != orderId) {
      return next({
        status: 400,
        message: `Dish id does not match route id. Dish: ${id}, Route: ${orderId}`,
      });
    }
    return next();
  }
}

//Validate: status
function isValidStatus(req, res, next) {
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
async function update(req, res) {
  const updatedOrder = {
    ...req.body,
    id: res.locals.order.id,
  };
  const data = await ordersService.update(updatedOrder);
  res.json({ data });
}

//Method: Destroy
async function destroy(req, res, next) {
  if (res.locals.order.status === "pending") {
    //Removing order
    const data = await ordersService.delete(res.locals.order.id);
    res.status(204).json({ data });
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
    asyncErrorBoundary(hasProperties),
    asyncErrorBoundary(hasOnlyValidProperties),
    asyncErrorBoundary(isValidDishOrder),
    asyncErrorBoundary(isValidQuantity),
    asyncErrorBoundary(updateDishesOrdersTable),
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(orderExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(hasRequiredProperties),
    asyncErrorBoundary(hasOnlyValidProperties),
    asyncErrorBoundary(orderExists),
    asyncErrorBoundary(idMatches),
    asyncErrorBoundary(isValidDishOrder),
    asyncErrorBoundary(isValidQuantity),
    asyncErrorBoundary(isValidStatus),
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(orderExists), asyncErrorBoundary(destroy)],
};

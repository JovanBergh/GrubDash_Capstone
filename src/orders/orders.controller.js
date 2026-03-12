const path = require("path");
const ordersService = require("./orders.service");
const nextId = require("../utils/nextId");

//Error handling
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

//JOIN TABLE METHODS


//MAIN METHODS
async function list(req, res) {
  const data = await ordersService.list();
  res.json({ data });
} // list

function read(req, res) {
  res.json({ data: res.locals.order });
} // read

async function create(req, res) {
  const { deliverTo, mobileNumber, dishes } = req.body.data;

  const newOrder = await ordersService.create({
    //updating orders DB
    deliverTo: deliverTo,
    mobileNumber: mobileNumber,
  });

  for (const dish of dishes) {
    await ordersService.joinTable.create({
      //updating orders DB dependencies
      order_id: newOrder.order_id,
      dish_id: dish.dish_id,
      quantity: dish.quantity,
    });
  } // Adding

  res.status(201).json({ data: await ordersService.read(newOrder.order_id) });
} // create

async function update(req, res) {
  const updatedOrder = {
    ...req.body,
    order_id: res.locals.order.id,
  };
  const data = await ordersService.update(updatedOrder);
  res.json({ data });
} // update

async function destroy(req, res, next) {
  if (res.locals.order.status == "pending") {
    const data = await ordersService.delete(res.locals.order.id); //Removing Order from DB
    res.status(204).json({ data });
  } // if(order.status == pending)

  return next({
    status: 400,
    message: "An order cannot be deleted unless it is pending.",
  });
} // destroy

//VALIDATION METHODS
const VALID_PROPERTIES = [
  "id",
  "deliverTo",
  "mobileNumber",
  "status",
  "dishes",
]; // VALID_PROPERTIES

const hasRequiredProperties = hasProperties(
  "deliverTo",
  "mobileNumber",
  "dishes",
); // hasRequiredProperties

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
  } // if(invalidFields > 0)

  next();
} // hasOnlyValidProperties

function isValidDishOrder(req, res, next) {
  const { data: { dishes } = {} } = req.body;

  if (!dishes) {
    return next({
      status: 400,
      message: "Order must include a dish",
    });
  } // if (!dishes)

  if (Array.isArray(dishes) && dishes.length > 0) {
    res.locals.order = req.body.data;
    return next();
  } // if (Array(dishes).length >0)

  return next({
    status: 400,
    message: "Order must include at least one dish",
  });
} //isValidDishOrder

function isValidQuantity(req, res, next) {
  const dishes = res.locals.order.dishes;
  for (i = 0; i < dishes.length; i++) {
    const { quantity } = dishes[i];
    if (
      !quantity ||
      typeof Number(quantity) != "number" ||
      Number(quantity) <= 0
    ) {
      return next({
        status: 400,
        message: `dish ${i + 1} must have a quantity that is an integer greater than 0`,
      });
    }
  }
  return next();
} // isValidQuantity

async function orderExists(req, res, next) {

  const { orderId } = req.params;

  const foundOrder = await ordersService.read(orderId); // Searching DB

  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  }// (foundOrder)

  return next({
    status: 404,
    message: `${orderId} not found`,
  });

} // orderExists

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
} // idMatches

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
} // isValidStatus

//Export
module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(hasRequiredProperties),
    asyncErrorBoundary(hasOnlyValidProperties),
    asyncErrorBoundary(isValidDishOrder),
    asyncErrorBoundary(isValidQuantity),
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

const path = require("path");
const nextId = require("../utils/nextId");

const dishesService = require("./dishes.service");

//Error handling
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");


const VALID_PROPERTIES = ["name", "description", "price", "image_url"];

const hasRequiredProperties = hasProperties("name", "price");

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

//Method: List
async function list(req, res) {
  res.json({ data: await dishesService.list() });
}

//Validate: price
function isValidPrice(req, res, next) {
  const { data: { price } = {} } = req.body;
  if (typeof price == "number" && price > 0) {
    return next();
  }
  return next({
    status: 400,
    message: "Dish must have a price that is an integer greater than 0",
  });
}

//Methood: Create
async function create(req, res) {
  const data = await dishesService.create(req.body.data);
  res.status(201).json({ data });
}

//Validate: id
async function dishExists(req, res, next) {
  const foundDish = await dishesService.checkDishId(req.params.dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  return next({
    status: 404,
    message: `${dishId} not found`,
  });
}

//Method: Read
function read(req, res) {
  res.json({ data: res.locals.dish });
}

//Validate: req.body.id
function idMatches(req, res, next) {
  const { data: { id } = {} } = req.body;
  const { dishId } = req.params;
  if (id) {
    if (id != dishId) {
      return next({
        status: 400,
        message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
      });
    }
  }
  return next();
}

//Method: Update
async function update(req, res) {
  const updatedDish = {
    ...req.body.data,
    id: res.locals.dish.id,
  };
  const data = await dishesService.update(updatedDish);
  res.status(200).json({ data });
}

//Export
module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(hasRequiredProperties),
    asyncErrorBoundary(hasOnlyValidProperties),
    asyncErrorBoundary(isValidPrice),
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(dishExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(hasRequiredProperties),
    asyncErrorBoundary(hasOnlyValidProperties),
    asyncErrorBoundary(dishExists),
    asyncErrorBoundary(idMatches),
    asyncErrorBoundary(isValidPrice),
    asyncErrorBoundary(update),
  ],
};

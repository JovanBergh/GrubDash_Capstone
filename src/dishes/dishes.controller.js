const path = require("path");
const nextId = require("../utils/nextId");
const dishesService = require("./dishes.service");

//Error handling
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");


//MAIN METHODS

function read(req, res) {
  res.json({ data: res.locals.dish });
}// read

async function list(req, res) {
  res.json({ data: await dishesService.list() });
}// list

async function create(req, res) {
  const { name, description, price, image_url } = req.body.data;
  const newDish = {
    name: name,
    description: description || "",
    price: price,
    image_url: image_url || "",
  } 
  const data = await dishesService.create(newDish);
  res.status(201).json({ data });
}// create

async function update(req, res) {
  const { name, description, price, image_url } = req.body.data;
  dishId = req.params.dishId;
  newDish = {
    name: name,
    description: description,
    price: price,
    image_url: image_url,

  }
  const data = await dishesService.update(dishId, newDish);
  res.status(200).json({ data });
}// update

async function destroy(req, res) {
  dishId = req.params.dishId;
  await dishesService.destroy(dishId);
  res.status(201);
}// destroy 

//VALIDATION METHODS

const VALID_PROPERTIES = ["id", "name", "description", "price", "image_url"];

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

async function doesDishExist(req, res, next) {
  const foundDish = await dishesService.read(req.params.dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  return next({
    status: 404,
    message: `${dishId} not found`,
  });
}// doesDishExist

function idBodyAndHeaderMatch(req, res, next) {
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

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(hasRequiredProperties),
    asyncErrorBoundary(hasOnlyValidProperties),
    asyncErrorBoundary(isValidPrice),
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(doesDishExist), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(hasRequiredProperties),
    asyncErrorBoundary(hasOnlyValidProperties),
    asyncErrorBoundary(doesDishExist),
    asyncErrorBoundary(idBodyAndHeaderMatch),
    asyncErrorBoundary(isValidPrice),
    asyncErrorBoundary(update),
  ],
  delete: [
    asyncErrorBoundary(doesDishExist),
    asyncErrorBoundary(destroy),
  ]
};// module.exports

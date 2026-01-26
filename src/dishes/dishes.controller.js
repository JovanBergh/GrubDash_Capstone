const path = require("path");

// Use the existing dishes data
const dishes = require("../data/dishes-data");

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");
const { isNumberObject } = require("util/types");

//Method: List
function list(req, res) {
  res.json({ data: dishes });
}

//Validate: req.body
function valid(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    return next({
      status: 400,
      message: `Dish must include ${propertyName}`,
    });
  };
}

//Validate: price
function isPrice(req, res, next) {
  const { data: { price } = {} } = req.body;
  if (Number(price) && price >= 0) {
    return next();
  }
  return next({
    status: 400,
    message: "Dish must have a price that is an integer greater than 0",
  });
}

//Methd: Create
function create(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  newDish = {
    id: nextId(),
    name: name,
    description: description,
    price: price,
    image_url: image_url,
  };

  //Adding dish
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

//Validate: id
function idPresent(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);

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

//Export
module.exports = {
  list,
  create: [
    valid("name"),
    valid("description"),
    valid("price"),
    isPrice,
    valid("image_url"),
    create,
  ],
  read: [idPresent, read],
};

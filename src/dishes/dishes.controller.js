const path = require("path");
const valid = require("../errors/validProperty")

// Use the existing dishes data
const dishes = require("../data/dishes-data");

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

//Method: List
function list(req, res) {
  res.json({ data: dishes });
}

//Validate: price
function isPrice(req, res, next) {
  const { data: { price } = {} } = req.body;
  if (typeof(price) == "number" && price > 0) {
    return next();
  }
  return next({
    status: 400,
    message: "Dish must have a price that is an integer greater than 0",
  });
}

//Methood: Create
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
function idCheck(req, res, next) {
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

//Validate: req.body.id
function idMatch(req, res, next) {
  const { data: { id } = {} } = req.body;
  const { dishId } = req.params;
  if (id && id != dishId) {
    return next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
    });
  }
  return next();
}

//Method: Update
function update(req, res) {
  const dishId = req.params;
  const { data: { name, description, price, image_url } = {} } = req.body;
  i = dishes.find((dish) => dish.id === dishId);
  uDish = res.locals.dish;

  //Updating values
  uDish.name = name;
  uDish.description = description;
  uDish.price = price;
  uDish.image_url = image_url;

  //Adding to dishes
  dishes.splice(i, 1, uDish);
  res.status(200).json({ data: uDish });
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
  read: [idCheck, read],
  update: [
    idCheck,
    idMatch,
    valid("name"),
    valid("description"),
    valid("price"),
    isPrice,
    valid("image_url"),
    update,
  ],
};

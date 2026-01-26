const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

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

//Export
module.exports = {
  list,
  create:[
    valid("name"),
  ]
};

const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

//Method: List
function list(req, res) {
  res.json({ data: dishes });
}

//Export
module.exports = {
    list,
};

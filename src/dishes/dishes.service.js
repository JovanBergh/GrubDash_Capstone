const knex = require("../db/connection"); //Defining knex connection

function list() {
  return knex("dishes").select("*");
}

function create(dish) {
  return knex("dishes")
  .insert(dish)
  .returning("*")
  .then((createdRecords) => createdRecords[0]);
}

function checkDishId(dishId) {
    return knex("dishes").select("*").where({ id: dishId });
}

module.exports = {
  list,
  create,
  checkDishId,
};

const knex = require("../db/connection"); //Defining knex connection

function list() {
  return knex("dishes as d").select("d.dish_id as id", "d.name", "d.description", "d.price", "d.image_url");
}

function create(dish) {
  return knex("dishes")
  .insert(dish)
  .returning("*")
  .then((createdRecords) => createdRecords[0]);
}

function checkDishId(dishId) {
    return knex("dishes as d").select("d.dish_id as id", "d.name", "d.description", "d.price", "d.image_url").where({ dish_id: dishId });
}

module.exports = {
  list,
  create,
  checkDishId,
};

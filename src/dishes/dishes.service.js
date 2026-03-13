const knex = require("../db/connection"); //Defining knex connection

function list() {
  return knex("dishes as d").select(
    "d.dish_id as id",
    "d.name",
    "d.description",
    "d.price",
    "d.image_url",
  );
}// list

function read(dishId) {
  return knex("dishes as d")
    .select(
      "d.dish_id as id",
      "d.name",
      "d.description",
      "d.price",
      "d.image_url",
    )
    .where({ dish_id: dishId })
    .then((result) => result[0]);
}// read

function create(dish) {
  return knex("dishes")
    .insert(dish)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}// create

function update(dishId, dish) {
  return knex("dishes as d").where({ dish_id: dishId }).update(dish);
}// update

function destroy (dishId) {
  return knex("dishes").where({ dish_id: dishId }).del();
}// destroy

module.exports = {
  list,
  create,
  read,
  update,
  delete: destroy
};

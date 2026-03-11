const knex = require("../db/connection"); //Defining knex connection
const mapProperties = require("../utils/map-properties"); //importing mapProperties for read function
const nestOneToMany = require("../utils/nestOneToMany");
//Modify Table: Dishes
const addDishProperty = mapProperties({
  dish_id: "dish.id",
  name: "dish.name",
  price: "dish.price",
  quantity: "dish.quantity",
  description: "dish.description",
  image_url: "dish.image_url",
});

const DISH_KEYS = [
    "dish_id",
    "name",
    "description",
    "price",
    "image_url",
    "quantity",

]

function list() {
  return knex("orders as o")
    .join("orders_dishes as od", "o.order_id", "od.order_id")
    .join("dishes as d", "od.dish_id", "d.dish_id")
    .select("o.*", "d.*", "od.quantity")
    .then((rows) => rows.map(addDishProperty))
    .then(cleanedRows => nestOneToMany(cleanedRows, DISH_KEYS));
}

function updateDishesOrdersTable(entry) {
  return knex("orders_dishes").insert({ entry });
}

async function create(order) {
  return await knex("orders")
    .insert(order)
    .returning("*")
    .then((createdRecords) => createdRecords[0])
    .then(addDish);
}

function checkOrderId(orderId) {
  return knex("orders as o")
    .join("orders_dishes as od", "o.id", "od.order_id")
    .join("dishes as d", "od.dish_id", "d.id")
    .select("o.*", "d.*", "od.quantity")
    .where({ "o.id": orderId })
    .first()
    .then(addDish);
}

function destroy(orderId) {
  return knex("orders").where({ id: orderId }).del();
}

module.exports = {
  list,
  create,
  updateDishesOrdersTable,
  checkOrderId,
  delete: destroy,
};

const knex = require("../db/connection"); //Defining knex connection
const mapProperties = require("../utils/map-properties"); //importing mapProperties for read function
const nestOneToMany = require("../utils/nestOneToMany");

// MAIN METHODS
function list() {
  return knex("orders as o")
    .leftJoin("orders_dishes as od", "o.order_id", "od.order_id")
    .leftJoin("dishes as d", "od.dish_id", "d.dish_id")
    .select(
      "o.order_id as id",
      "o.deliverTo",
      "o.mobileNumber",
      "o.status", 
      "d.dish_id",
      "d.name",
      "d.description",
      "d.price",
      "d.image_url",   
      "od.quantity"
    )
    .then((rows) => rows.map(addDishProperty))
    .then(cleanedRows => nestOneToMany(cleanedRows, DISH_KEYS));
} // list

function read(orderId) {
  return knex("orders as o")
    .leftJoin("orders_dishes as od", "o.order_id", "od.order_id")
    .leftJoin("dishes as d", "od.dish_id", "d.dish_id")
    .select(
      "o.order_id as id",
      "o.deliverTo",
      "o.mobileNumber",
      "o.status", 
      "d.dish_id",
      "d.name",
      "d.description",
      "d.price",
      "d.image_url",   
      "od.quantity"
    )
    .where({"o.order_id": orderId})
    .then((rows) => rows.map(addDishProperty))
    .then(cleanedRows => nestOneToMany(cleanedRows, DISH_KEYS))
    .then((createdRecords) => createdRecords[0]);
}// read

async function create(order) {
  return await knex("orders as o")
    .insert(order)
    .returning(
      "o.order_id as id")
    .then((createdRecords) => createdRecords[0]);
}// create

function destroy(orderId) {
  return knex("orders").where({ order_id: orderId }).del();
}// destroy

//JOIN TABLE METHODS
function createDishesOrdersTableEntry(entry) {
  return knex("orders_dishes").insert(entry);
} // createDishesOrdersTableEntry

function removeDishesOrdersTableEntry(order_id, dish_id) {
  return knex("orders_dishes").where({order_id, dish_id}).del();
} // removeDishesOrdersTableEntry

//Modify Table: Dishes
const DISH_KEYS = [
    "id",
    "name",
    "description",
    "price",
    "image_url",
    "quantity",

]; // DISH_KEYS

const addDishProperty = mapProperties({
  dish_id: "dish.id",
  name: "dish.name",
  price: "dish.price",
  description: "dish.description",
  image_url: "dish.image_url",
  quantity: "dish.quantity"
}); // addDishProperty

module.exports = {
  list,
  create, 
  read,
  joinTable: {
    create: createDishesOrdersTableEntry,
    delete: removeDishesOrdersTableEntry,
  },
  delete: destroy,
};


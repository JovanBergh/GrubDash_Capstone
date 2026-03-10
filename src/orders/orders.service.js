const knex = require("../db/connection"); //Defining knex connection
const mapProperties = require("../utils/map-properties"); //importing mapProperties for read function

//Modify Table: Dishes
const addDish = mapProperties({
    dish_id: "dishes.id",
    dish_name: "dishes.name",
    dish_price: "dishes.price",
    dish_description: "dishes.description",
    dish_image: "dishes.image_url"
})

function list() {
    return knex("orders").select(("*"));
}


function updateDishesOrdersTable() {
    return knex("orders_dishes").insert({ order_id: res.locals.order.id, dish_id: res.locals.dish.id, quantity: res.locals.dish.quantity });
}

async function create(order) {
    return await knex("orders")
    .insert(order)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function checkOrderId(orderId) {
    return knex("orders").select("*").where({ id: orderId });
}

function destroy(orderId) {
    return knex("orders").where({ id: orderId }).del();
}

module.exports = {
    list,
    create,
    updateDishesOrdersTable,
    checkOrderId,
    delete: destroy
}
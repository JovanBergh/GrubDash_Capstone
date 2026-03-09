const knex = require("../db/connection"); //Defining knex connection
const dishesController = require("../dishes/dishes.controller");
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


function updateDishesOrdersTable(dish) {
    return knex("orders_dishes").insert({ order_id: order.id, dish_id: dish.id, quantity: dish.quantity });
}

async function create(order) {
    return await knex("orders").insert({ id: order.id, deliverTo: order.deliverTo, status: order.status }).returning("*");
}

module.exports = {
    list,
    create,
    updateDishesOrdersTable
}
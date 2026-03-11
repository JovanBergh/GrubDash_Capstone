const knex = require("../db/connection"); //Defining knex connection
const mapProperties = require("../utils/map-properties"); //importing mapProperties for read function


//Modify Table: Dishes
const addDish = mapProperties({
    dish_id: "dishes.dish_id",
    name: "dishes.name",
    price: "dishes.price",
    quantity: "dishes.quantity",
    description: "dishes.description",
    image_url: "dishes.image_url"
})

function addDishes() {
    return dishes = [addDish];
}
function list() {
    return knex("orders").select(("*"));
}


function updateDishesOrdersTable(entry) {
    return knex("orders_dishes").insert({ entry });
}

async function create(order) {
    return await knex("orders")
    .insert(order)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function checkOrderId(orderId) {
    return knex("orders as o")
        .join("orders_dishes as od", "o.order_id", "od.order_id")
        .join("dishes as d", "od.dish_id", "d.dish_id")
        .select("o.*", "d.*", "od.quantity")
        .where({ "o.order_id": orderId })
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
}
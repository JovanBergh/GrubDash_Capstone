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

module.exports = {
    list,
}
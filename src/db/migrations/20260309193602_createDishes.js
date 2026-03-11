/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const nextId = require("../../utils/nextId");

exports.up = function(knex) {
  return knex.schema.createTable("dishes", (table) => {
    table.uuid("dish_id", (options = { primaryKey: true })).defaultTo(nextId());
    table.string("name");
    table.string("description");
    table.float("price");
    table.string("image_url");
  });  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("dishes");  
};

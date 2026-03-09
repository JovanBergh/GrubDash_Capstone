/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const nextId = require("../../utils/nextId");

exports.up = function(knex) {
  return knex.schema.createTable("orders", (table) => {
    table.uuid("id", (options = { primaryKey: true })).defaultTo(nextId());
    table.string("deliverTo");
    table.string("mobileNumber");
    table.string("status");
  }); 
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("orders");  
};

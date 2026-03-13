const { transaction } = require("../connection");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table("orders", (table) => {
    table.string("status").defaultTo("pending").notNullable().alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table("orders", (table) => {
    table.string("status").defaultTo("").notNullable().alter();
  });  
};

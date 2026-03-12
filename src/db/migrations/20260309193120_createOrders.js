/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */


exports.up = function (knex) {
  return knex.schema.createTable("orders", (table) => {
    table.uuid("id", (options = { primaryKey: true })).defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("deliverTo");
    table.string("mobileNumber");
    table.string("status");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("orders");
};

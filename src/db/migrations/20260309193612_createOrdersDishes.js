/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("orders_dishes", (table) => {
    table.uuid("order_id").notNullable();
    table
      .foreign("order_id")
      .references("order_id")
      .inTable("orders")
      .onDelete("CASCADE");
    table.uuid("dish_id").notNullable();
    table
      .foreign("dish_id")
      .references("dish_id")
      .inTable("dishes")
      .onDelete("CASCADE");

    table.integer("quantity").unsigned().notNullable().defaultTo(1);
  });  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("orders_dishes");  
};

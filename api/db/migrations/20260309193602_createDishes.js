/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("dishes", (table) => {
    table.uuid("id", (options = { primaryKey: true }));
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

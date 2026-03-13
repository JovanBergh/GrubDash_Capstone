/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table("orders", (table) => {
        table.string("status").notNullable().alter();
        table.string("deliverTo").notNullable().alter();
        table.string("mobileNumber").notNullable().alter();    
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table("orders", (table) => {
        table.string("status").nullable().alter();
        table.string("deliverTo").nullable().alter();
        table.string("mobileNumber").nullable().alter();
    }); 
};

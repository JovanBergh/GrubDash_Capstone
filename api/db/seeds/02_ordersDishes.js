/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('orders_dishes').del()
  await knex('orders_dishes').insert([
  {
    order_id: "f6069a542257054114138301947672ba",
    dish_id: "90c3d873684bf381dfab29034b5bba73",
    quantity: 1,
  },
  {
    order_id: "5a887d326e83d3c5bdcbee398ea32aff",
    dish_id: "d351db2b49b69679504652ea1cf38241",
    quantity: 2,
  },
  ]);
};

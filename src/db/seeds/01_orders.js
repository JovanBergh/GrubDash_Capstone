/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('orders').del()
  await knex('orders').insert([
  {
    id: "f6069a542257054114138301947672ba",
    deliverTo: "1600 Pennsylvania Avenue NW, Washington, DC 20500",
    mobileNumber: "(202) 456-1111",
    status: "out-for-delivery",
  },
  {
    id: "5a887d326e83d3c5bdcbee398ea32aff",
    deliverTo: "308 Negra Arroyo Lane, Albuquerque, NM",
    mobileNumber: "(505) 143-3369",
    status: "delivered",
  },
  ]);
};

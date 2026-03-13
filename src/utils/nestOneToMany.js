const _ = require("lodash");

function nestOneToMany(rows,childKeys) {
  const map = new Map();
  const result = [];

  for (const row of rows) {
    if (!map.has(row.id)) {
      map.set(row.id, {
        ..._.omit(row, "dish"),
        dishes: [],
      });
    }
    if (row.dish?.id) {
      const dish = _.pick(row.dish, childKeys);
      map.get(row.id).dishes.push(dish);
    }
  }
  return Array.from(map.values());
}

module.exports = nestOneToMany;
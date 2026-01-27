//Validate: req.body
function valid(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    return next({
      status: 400,
      message: `Dish must include ${propertyName}`,
    });
  };
}

module.exports = valid;
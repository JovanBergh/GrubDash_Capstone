function normalizedDishes (orderId, dishes) { 
    return dishes.map((dish) => ({
      order_id: orderId,
      dish_id: dish.id,
      quantity: dish.quantity,
    }));
}

    module.exports = normalizedDishes;
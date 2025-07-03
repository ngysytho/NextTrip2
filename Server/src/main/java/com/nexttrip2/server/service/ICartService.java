package com.nexttrip2.server.service;

import com.nexttrip2.server.model.Cart;
import com.nexttrip2.server.model.CartItem;

public interface ICartService {
    Cart getCartByUserId(String userId);
    Cart addToCart(String userId, CartItem item);
    void clearCart(String userId);
}

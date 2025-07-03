package com.nexttrip2.server.service;

import com.nexttrip2.server.model.Cart;
import com.nexttrip2.server.model.CartItem;

import java.util.List;

public interface ICartService {
    Cart getCartByUserId(String userId);
    Cart addToCart(String userId, CartItem item);
    void clearCart(String userId);
    void removeMultipleItems(String userId, List<String> placeIds);
}

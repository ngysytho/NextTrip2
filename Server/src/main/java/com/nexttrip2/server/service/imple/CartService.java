package com.nexttrip2.server.service.imple;

import com.nexttrip2.server.model.Cart;
import com.nexttrip2.server.model.CartItem;
import com.nexttrip2.server.repository.CartRepository;
import com.nexttrip2.server.service.ICartService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartService implements ICartService {

    private final CartRepository cartRepository;

    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    @Override
    public Cart getCartByUserId(String userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserId(userId);
                    newCart.setItems(new ArrayList<>());
                    return cartRepository.save(newCart);
                });
    }

    @Override
    public Cart addToCart(String userId, CartItem item) {
        Cart cart = getCartByUserId(userId);
        boolean exists = cart.getItems().stream()
            .anyMatch(i -> i.getPlaceId().equals(item.getPlaceId()));

        if (!exists) {
            cart.getItems().add(item);
        }
        return cartRepository.save(cart);
    }

    @Override
    public void clearCart(String userId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    @Override
    public void removeMultipleItems(String userId, List<String> placeIds) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().removeIf(item -> placeIds.contains(item.getPlaceId()));
        cartRepository.save(cart);
    }
}

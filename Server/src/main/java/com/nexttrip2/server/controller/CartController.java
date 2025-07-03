package com.nexttrip2.server.controller;

import com.nexttrip2.server.dto.CartItemRequestDTO;
import com.nexttrip2.server.model.Cart;
import com.nexttrip2.server.model.CartItem;
import com.nexttrip2.server.responses.CartResponse;
import com.nexttrip2.server.service.ICartService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final ICartService cartService;

    public CartController(ICartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public CartResponse getCart(@PathVariable String userId) {
        Cart cart = cartService.getCartByUserId(userId);
        return new CartResponse(cart.getUserId(), cart.getItems());
    }

    @PostMapping("/{userId}/add")
    public CartResponse addToCart(@PathVariable String userId, @RequestBody CartItemRequestDTO request) {
        CartItem item = new CartItem(request.getPlaceId(), request.getName(), request.getPrice());
        Cart cart = cartService.addToCart(userId, item);
        return new CartResponse(cart.getUserId(), cart.getItems());
    }

    @PostMapping("/{userId}/clear")
    public String clearCart(@PathVariable String userId) {
        cartService.clearCart(userId);
        return "Đã xoá giỏ hàng";
    }
}

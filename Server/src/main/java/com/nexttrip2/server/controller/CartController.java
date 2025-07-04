package com.nexttrip2.server.controller;

import com.nexttrip2.server.dto.CartItemRequestDTO;
import com.nexttrip2.server.dto.DeleteCartItemsRequest;
import com.nexttrip2.server.model.Cart;
import com.nexttrip2.server.model.CartItem;
import com.nexttrip2.server.responses.CartResponse;
import com.nexttrip2.server.service.ICartService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final ICartService cartService;

    public CartController(ICartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public CartResponse getCart() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Cart cart = cartService.getCartByUserId(userId);
        return new CartResponse(cart.getUserId(), cart.getItems());
    }

    @PostMapping("/add")
    public CartResponse addToCart(@RequestBody CartItemRequestDTO request) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        CartItem item = new CartItem(
            request.getPlaceId(),
            request.getName(),
            request.getPrice(),
            request.getImageUrl(),
            request.getDescription(),
            request.getAddress()
        );
        Cart cart = cartService.addToCart(userId, item);
        return new CartResponse(cart.getUserId(), cart.getItems());
    }

    @PostMapping("/clear")
    public String clearCart() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        cartService.clearCart(userId);
        return "Đã xoá giỏ hàng";
    }

    @PostMapping("/remove-multiple")
    public String removeMultipleItems(@RequestBody DeleteCartItemsRequest request) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        cartService.removeMultipleItems(userId, request.getPlaceIds());
        return "Đã xoá các mục đã chọn";
    }
}

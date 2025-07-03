package com.nexttrip2.server.responses;

import com.nexttrip2.server.model.CartItem;
import java.util.List;
import java.util.stream.Collectors;

public class CartResponse {

    private String userId;
    private List<CartItemResponseDTO> items;
    private int total;

    public CartResponse(String userId, List<CartItem> items) {
        this.userId = userId;
        this.items = items.stream().map(item ->
            new CartItemResponseDTO(
                item.getPlaceId(),
                item.getName(),
                item.getPrice(),
                item.getImageUrl(),
                item.getDescription(),
                item.getAddress()
            )
        ).collect(Collectors.toList());
        this.total = items.stream().mapToInt(CartItem::getPrice).sum();
    }

    public String getUserId() { return userId; }
    public List<CartItemResponseDTO> getItems() { return items; }
    public int getTotal() { return total; }
}

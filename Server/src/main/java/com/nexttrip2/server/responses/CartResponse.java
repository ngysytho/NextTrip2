package com.nexttrip2.server.responses;

import com.nexttrip2.server.model.CartItem;
import java.util.List;

public class CartResponse {

    private String userId;
    private List<CartItem> items;
    private int total;

    public CartResponse(String userId, List<CartItem> items) {
        this.userId = userId;
        this.items = items;
        this.total = items.stream().mapToInt(CartItem::getPrice).sum();
    }

    public String getUserId() { return userId; }
    public List<CartItem> getItems() { return items; }
    public int getTotal() { return total; }
}

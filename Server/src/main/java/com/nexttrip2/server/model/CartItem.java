package com.nexttrip2.server.model;

public class CartItem {

    private String placeId;
    private String name;
    private int price;

    public CartItem() {}

    public CartItem(String placeId, String name, int price) {
        this.placeId = placeId;
        this.name = name;
        this.price = price;
    }

    public String getPlaceId() { return placeId; }
    public void setPlaceId(String placeId) { this.placeId = placeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }
}

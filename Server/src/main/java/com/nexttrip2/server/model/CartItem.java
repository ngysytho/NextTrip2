package com.nexttrip2.server.model;

public class CartItem {

    private String placeId;
    private String name;
    private int price;
    private String imageUrl;
    private String description;
    private String address;

    public CartItem() {}

    public CartItem(String placeId, String name, int price, String imageUrl, String description, String address) {
        this.placeId = placeId;
        this.name = name;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this.address = address;
    }

    public String getPlaceId() { return placeId; }
    public void setPlaceId(String placeId) { this.placeId = placeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}

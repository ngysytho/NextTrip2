package com.nexttrip2.server.model;

import java.util.List;

public class TripPlace {

    private String placeId;
    private String name;
    private String address;
    private String description;
    private int price;
    private int orderIndex;

    // ✅ Thêm mới
    private String startTime;  // giờ bắt đầu (vd: "08:00")
    private String endTime;    // giờ kết thúc (vd: "10:30")
    private List<String> menu; // danh sách món ăn
    private String note;       // ghi chú riêng

    // === GETTERS & SETTERS ===

    public String getPlaceId() { return placeId; }
    public void setPlaceId(String placeId) { this.placeId = placeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }

    public int getOrderIndex() { return orderIndex; }
    public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public List<String> getMenu() { return menu; }
    public void setMenu(List<String> menu) { this.menu = menu; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}

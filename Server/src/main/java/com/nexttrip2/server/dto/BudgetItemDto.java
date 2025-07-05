package com.nexttrip2.server.dto;

public class BudgetItemDto {

    private String category;
    private String name;
    private String quantity;
    private String estimate;
    private String total;
    private String note;

    // Constructors
    public BudgetItemDto() {}

    public BudgetItemDto(String category, String name, String quantity, String estimate, String total, String note) {
        this.category = category;
        this.name = name;
        this.quantity = quantity;
        this.estimate = estimate;
        this.total = total;
        this.note = note;
    }

    // Getters & Setters
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getQuantity() { return quantity; }
    public void setQuantity(String quantity) { this.quantity = quantity; }

    public String getEstimate() { return estimate; }
    public void setEstimate(String estimate) { this.estimate = estimate; }

    public String getTotal() { return total; }
    public void setTotal(String total) { this.total = total; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}

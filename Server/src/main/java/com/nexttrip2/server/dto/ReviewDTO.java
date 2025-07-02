package com.nexttrip2.server.dto;

public class ReviewDTO {
    private String reviewId;
    private String username;
    private String comment;
    private int rating;

    // ✅ Constructors
    public ReviewDTO() {}

    public ReviewDTO(String reviewId, String username, String comment, int rating) {
        this.reviewId = reviewId;
        this.username = username;
        this.comment = comment;
        this.rating = rating;
    }

    // ✅ Getters & Setters

    public String getReviewId() {
        return reviewId;
    }

    public void setReviewId(String reviewId) {
        this.reviewId = reviewId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }
}

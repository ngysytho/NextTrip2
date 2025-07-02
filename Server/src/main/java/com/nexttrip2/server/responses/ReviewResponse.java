package com.nexttrip2.server.responses;

public class ReviewResponse {
    private String reviewId;
    private String placeId;
    private String userId;
    private String username;
    private String comment;
    private Float rating; // ✅ Đổi int -> Float

    public ReviewResponse() {}

    public ReviewResponse(String reviewId, String placeId, String userId, String username, String comment, Float rating) {
        this.reviewId = reviewId;
        this.placeId = placeId;
        this.userId = userId;
        this.username = username;
        this.comment = comment;
        this.rating = rating;
    }

    // ✅ Getters & Setters
    public String getReviewId() { return reviewId; }
    public void setReviewId(String reviewId) { this.reviewId = reviewId; }

    public String getPlaceId() { return placeId; }
    public void setPlaceId(String placeId) { this.placeId = placeId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Float getRating() { return rating; }
    public void setRating(Float rating) { this.rating = rating; }
}

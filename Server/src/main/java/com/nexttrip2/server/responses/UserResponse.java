package com.nexttrip2.server.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nexttrip2.server.model.User;

import java.util.Date;

public class UserResponse {

    @JsonProperty("id")
    private String id;

    @JsonProperty("email_user")
    private String email_user;

    @JsonProperty("username_user")
    private String username_user;

    @JsonProperty("displayName_user")
    private String displayName_user;

    @JsonProperty("birth_date_user")
    private Date birth_date_user;

    @JsonProperty("isActive_user")
    private Boolean isActive_user;

    @JsonProperty("createdAt")
    private Date createdAt;

    @JsonProperty("updatedAt")
    private Date updatedAt;

    public UserResponse(User user) {
        this.id = user.getId();
        this.email_user = user.getEmail_user();
        this.username_user = user.getUsername_user();
        this.displayName_user = user.getDisplayName_user();
        this.birth_date_user = user.getBirth_date_user();
        this.isActive_user = user.getIsActive_user();
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
    }

    // Optional: Getters (nếu dùng với Jackson thì không bắt buộc)
    public String getId() {
        return id;
    }

    public String getEmail_user() {
        return email_user;
    }

    public String getUsername_user() {
        return username_user;
    }

    public String getDisplayName_user() {
        return displayName_user;
    }

    public Date getBirth_date_user() {
        return birth_date_user;
    }

    public Boolean getIsActive_user() {
        return isActive_user;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }
}

package com.nexttrip2.server.model;

import java.util.Date;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "Users")
public class User {

    @Id
    private String id;

    private String userId = UUID.randomUUID().toString();

    @Field("email_user")
    private String email_user;

    @Field("password_user")
    private String password_user;

    @Field("username_user")
    private String username_user;

    @Field("displayName_user")
    private String displayName_user;

    @Field("birth_date")
    private Date birth_date;

    @Field("verifyToken_user")
    private String verifyToken_user;

    @Field("isActive_user")
    private Boolean isActive_user = false; // ✅ dùng Boolean thay vì boolean

    @Field("createdAt_user")
    private Date createdAt_user = new Date();

    // ======== Getters và Setters ========

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEmail_user() {
        return email_user;
    }

    public void setEmail_user(String email_user) {
        this.email_user = email_user;
    }

    public String getPassword_user() {
        return password_user;
    }

    public void setPassword_user(String password_user) {
        this.password_user = password_user;
    }

    public String getUsername_user() {
        return username_user;
    }

    public void setUsername_user(String username_user) {
        this.username_user = username_user;
    }

    public String getDisplayName_user() {
        return displayName_user;
    }

    public void setDisplayName_user(String displayName_user) {
        this.displayName_user = displayName_user;
    }

    public Date getBirth_date() {
        return birth_date;
    }

    public void setBirth_date(Date birth_date) {
        this.birth_date = birth_date;
    }

    public String getVerifyToken_user() {
        return verifyToken_user;
    }

    public void setVerifyToken_user(String verifyToken_user) {
        this.verifyToken_user = verifyToken_user;
    }

    public Boolean getIsActive_user() {
        return isActive_user;
    }

    public void setIsActive_user(Boolean isActive_user) {
        this.isActive_user = isActive_user;
    }

    public Date getCreatedAt_user() {
        return createdAt_user;
    }

    public void setCreatedAt_user(Date createdAt_user) {
        this.createdAt_user = createdAt_user;
    }
}

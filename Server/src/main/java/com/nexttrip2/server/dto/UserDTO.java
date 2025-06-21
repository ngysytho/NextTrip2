package com.nexttrip2.server.dto;

public class UserDTO {
    private String username_user;
    private String displayName_user;
    private String email_user;
    private String birth_date_user;

    // ✅ Constructor rỗng (mặc định)
    public UserDTO() {}

    // ✅ Constructor đầy đủ để truyền dữ liệu
    public UserDTO(String username_user, String displayName_user, String email_user, String birth_date_user) {
        this.username_user = username_user;
        this.displayName_user = displayName_user;
        this.email_user = email_user;
        this.birth_date_user = birth_date_user;
    }

    // ✅ Getters và Setters
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

    public String getEmail_user() {
        return email_user;
    }

    public void setEmail_user(String email_user) {
        this.email_user = email_user;
    }

    public String getBirth_date_user() {
        return birth_date_user;
    }

    public void setBirth_date_user(String birth_date_user) {
        this.birth_date_user = birth_date_user;
    }
}


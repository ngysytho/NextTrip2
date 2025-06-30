package com.nexttrip2.server.dto;

public class UpdateProfileRequestDTO {
    private String email;
    private String displayName;
    private String username;
    private String birth;
    private String gender;

    // Getters và Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getBirth() { return birth; }
    public void setBirth(String birth) { this.birth = birth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
}

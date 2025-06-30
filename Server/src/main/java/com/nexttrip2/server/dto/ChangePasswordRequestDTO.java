package com.nexttrip2.server.dto;

public class ChangePasswordRequestDTO {
    private String email;
    private String oldPassword;
    private String newPassword;

    // Constructors
    public ChangePasswordRequestDTO() {}

    public ChangePasswordRequestDTO(String email, String oldPassword, String newPassword) {
        this.email = email;
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }

    // Getters và Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getOldPassword() { return oldPassword; }
    public void setOldPassword(String oldPassword) { this.oldPassword = oldPassword; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}

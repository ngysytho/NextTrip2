package com.nexttrip2.server.responses;

import com.nexttrip2.server.model.User;
import java.text.SimpleDateFormat;
import java.util.Date;

public class UserResponse {

    private String userId; // ✅ đổi camelCase theo convention
    private String username;
    private String displayName;
    private String email;
    private String birthDate;
    private String gender;

    // ✅ Constructor mapping User -> UserResponse
    public UserResponse(User user) {
        this.userId = user.getUserId(); // ✅ gọi đúng getter
        this.username = user.getUsername_user();
        this.displayName = user.getDisplayName_user();
        this.email = user.getEmail_user();
        this.birthDate = formatDate(user.getBirth_date_user());
        this.gender = user.getGender_user();
    }

    // ✅ Format birth date thành string yyyy-MM-dd
    private String formatDate(Date birthDate) {
        if (birthDate == null) {
            return null;
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(birthDate);
    }

    // ✅ Getters
    public String getUserId() { return userId; }
    public String getUsername() { return username; }
    public String getDisplayName() { return displayName; }
    public String getEmail() { return email; }
    public String getBirthDate() { return birthDate; }
    public String getGender() { return gender; }

    // ✅ Optionally, add setters if needed (hiện tại chỉ cần getter cho response)
}

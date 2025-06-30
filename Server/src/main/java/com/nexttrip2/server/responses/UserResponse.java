package com.nexttrip2.server.responses;

import com.nexttrip2.server.model.User;
import java.text.SimpleDateFormat;
import java.util.Date;

public class UserResponse {

    private String username;
    private String displayName;
    private String email;
    private String birthDate;
    private String gender;

    // Constructor that maps User object to UserResponse
    public UserResponse(User user) {
        this.username = user.getUsername_user();
        this.displayName = user.getDisplayName_user();
        this.email = user.getEmail_user();
        this.birthDate = formatDate(user.getBirth_date_user());
        this.gender = user.getGender_user();
    }

    // Format the birth date to a string
    private String formatDate(Date birthDate) {
        if (birthDate == null) {
            return null;
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(birthDate);
    }

    // Getters
    public String getUsername() { return username; }
    public String getDisplayName() { return displayName; }
    public String getEmail() { return email; }
    public String getBirthDate() { return birthDate; }
    public String getGender() { return gender; }

    // Optionally, add setters if needed
}

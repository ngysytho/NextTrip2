package com.nexttrip2.server.service;

import com.nexttrip2.server.responses.UserResponse;
import com.nexttrip2.server.model.User;

public interface IUserService {
    void register(User user) throws Exception;

    boolean verifyCode(String email, String code);

    boolean verifyOtp(String email, String code); // nếu dùng OTP riêng

    boolean login(String email, String rawPassword);

    UserResponse getUserByEmail(String email);
}

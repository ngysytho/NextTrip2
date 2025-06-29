package com.nexttrip2.server.service;

import com.nexttrip2.server.responses.UserResponse;
import com.nexttrip2.server.model.User;

public interface IUserService {
    void register(User user) throws Exception;

    boolean verifyCode(String email, String code);

    User authenticate(String email, String rawPassword);  // ✅ Nếu dùng authenticate mới

    UserResponse getUserByEmail(String email);
}

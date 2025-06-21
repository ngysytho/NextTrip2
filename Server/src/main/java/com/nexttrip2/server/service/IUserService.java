package com.nexttrip2.server.service;

import com.nexttrip2.server.model.User;
import com.nexttrip2.server.responses.UserResponse;

public interface IUserService {
    void register(User user) throws Exception;

    boolean verifyCode(String email, String code);

    boolean login(String email, String rawPassword);
    UserResponse getUserByEmail(String email);

}

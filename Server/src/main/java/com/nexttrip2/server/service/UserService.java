package com.nexttrip2.server.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.nexttrip2.server.model.User;
import com.nexttrip2.server.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MailService mailService;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public void register(User user) throws Exception {
        Boolean emailExists = userRepository.existsByEmail_user(user.getEmail_user());
        if (Boolean.TRUE.equals(emailExists)) {
            throw new Exception("Email đã được đăng ký.");
        }

        Boolean usernameExists = userRepository.existsByUsername_user(user.getUsername_user());
        if (Boolean.TRUE.equals(usernameExists)) {
            throw new Exception("Username đã tồn tại.");
        }

        // Hash mật khẩu
        String hashedPassword = passwordEncoder.encode(user.getPassword_user());
        user.setPassword_user(hashedPassword);

        // Gán token và set inactive
        String token = UUID.randomUUID().toString();
        user.setVerifyToken_user(token);
        user.setIsActive_user(false);

        userRepository.save(user);
        mailService.sendVerificationEmail(user.getEmail_user(), token);
    }

    public boolean verify(String token) {
        User user = userRepository.findByVerifyToken_user(token);
        if (user != null) {
            user.setIsActive_user(true);
            user.setVerifyToken_user(null);
            userRepository.save(user);
            return true;
        }
        return false;
    }
}

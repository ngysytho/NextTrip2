package com.nexttrip2.server.service;

import com.nexttrip2.server.model.User;
import com.nexttrip2.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public void register(User user) throws Exception {
        if (user.getEmail_user() == null || user.getEmail_user().isEmpty()) {
            throw new Exception("Email không được để trống.");
        }

        if (user.getUsername_user() == null || user.getUsername_user().isEmpty()) {
            throw new Exception("Username không được để trống.");
        }

        if (user.getPassword_user() == null || user.getPassword_user().isEmpty()) {
            throw new Exception("Mật khẩu không được để trống.");
        }

        if (Boolean.TRUE.equals(userRepository.existsByEmail_user(user.getEmail_user()))) {
            throw new Exception("Email đã được đăng ký.");
        }

        if (Boolean.TRUE.equals(userRepository.existsByUsername_user(user.getUsername_user()))) {
            throw new Exception("Username đã tồn tại.");
        }

        // Mã hoá mật khẩu
        String hashedPassword = passwordEncoder.encode(user.getPassword_user());
        user.setPassword_user(hashedPassword);

        // Tạo mã xác nhận ngẫu nhiên
        String verifyToken = String.format("%06d", (int) (Math.random() * 1000000));
        user.setVerifyToken_user(verifyToken);
        user.setIsActive_user(false); // Mặc định chưa xác thực

        // Gửi mã xác thực qua email
        emailService.sendVerificationCode(user.getEmail_user(), verifyToken);
        System.out.println("Đã gửi mã xác thực tới: " + user.getEmail_user());

        // Lưu user vào database
        userRepository.save(user);
    }

    public boolean verifyCode(String email, String code) {
        Optional<User> userOpt = Optional.ofNullable(userRepository.findByEmail_user(email));
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getVerifyToken_user() != null && user.getVerifyToken_user().equals(code)) {
                user.setIsActive_user(true);
                user.setVerifyToken_user(null); // clear token
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }

    public boolean login(String email, String rawPassword) {
        User user = userRepository.findByEmail_user(email);
        return user != null &&
                Boolean.TRUE.equals(user.getIsActive_user()) &&
                passwordEncoder.matches(rawPassword, user.getPassword_user());
    }
}

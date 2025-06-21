package com.nexttrip2.server.service.imple;

import com.nexttrip2.server.model.User;
import com.nexttrip2.server.repository.UserRepository;
import com.nexttrip2.server.responses.UserResponse;
import com.nexttrip2.server.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService implements IUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
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

        String hashedPassword = passwordEncoder.encode(user.getPassword_user());
        user.setPassword_user(hashedPassword);

        String verifyToken = String.format("%06d", (int) (Math.random() * 1000000));
        user.setVerifyToken_user(verifyToken);
        user.setIsActive_user(false);

        emailService.sendVerificationCode(user.getEmail_user(), verifyToken);
        System.out.println("Đã gửi mã xác thực tới: " + user.getEmail_user());

        userRepository.save(user);
    }

    @Override
    public boolean verifyCode(String email, String code) {
        Optional<User> userOpt = Optional.ofNullable(userRepository.findByEmail_user(email));
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getVerifyToken_user() != null && user.getVerifyToken_user().equals(code)) {
                user.setIsActive_user(true);
                user.setVerifyToken_user(null);
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean login(String email, String rawPassword) {
        User user = userRepository.findByEmail_user(email);
        return user != null &&
                Boolean.TRUE.equals(user.getIsActive_user()) &&
                passwordEncoder.matches(rawPassword, user.getPassword_user());
    }



   @Override
    public UserResponse getUserByEmail(String email) {
        Optional<User> userOpt = Optional.ofNullable(userRepository.findByEmail_user(email));
        if (userOpt.isPresent()) {
            return new UserResponse(userOpt.get());
        }
        throw new RuntimeException("Không tìm thấy người dùng với email: " + email);
    }

}

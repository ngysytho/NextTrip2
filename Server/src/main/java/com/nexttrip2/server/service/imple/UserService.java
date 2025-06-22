package com.nexttrip2.server.service.imple;

import com.nexttrip2.server.model.User;
import com.nexttrip2.server.repository.UserRepository;
import com.nexttrip2.server.responses.UserResponse;
import com.nexttrip2.server.service.IUserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.SecureRandom;
import java.util.Date;
import java.util.Optional;

@Service
public class UserService implements IUserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

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

        // Nếu email đã xác minh => chặn
        if (userRepository.findActiveUserByEmail(user.getEmail_user()).isPresent()) {
            throw new Exception("Email đã được xác minh bởi tài khoản khác.");
        }

        // Nếu email đã tồn tại nhưng chưa xác minh => gửi lại mã xác minh mới
        Optional<User> existingUser = userRepository.findByEmail_user(user.getEmail_user());
        if (existingUser.isPresent() && !Boolean.TRUE.equals(existingUser.get().getIsActive_user())) {
            User pendingUser = existingUser.get();
            String newCode = String.format("%06d", new SecureRandom().nextInt(999999));
            pendingUser.setVerifyToken_user(newCode);
            pendingUser.setPassword_user(passwordEncoder.encode(user.getPassword_user()));
            emailService.sendVerificationCode(pendingUser.getEmail_user(), newCode);
            userRepository.save(pendingUser);
            throw new Exception("Email đã tồn tại nhưng chưa xác minh. Đã gửi lại mã xác nhận.");
        }

        // Username đã được xác minh bởi tài khoản khác => chặn
        if (userRepository.findActiveUserByUsername(user.getUsername_user()).isPresent()) {
            throw new Exception("Username đã được sử dụng bởi tài khoản xác minh.");
        }

        // Tạo mới tài khoản
        user.setPassword_user(passwordEncoder.encode(user.getPassword_user()));
        String verifyToken = String.format("%06d", new SecureRandom().nextInt(999999));
        user.setVerifyToken_user(verifyToken);
        user.setIsActive_user(false);
        user.setCreatedAt_user(new Date());
        user.setUpdatedAt_user(new Date());

        emailService.sendVerificationCode(user.getEmail_user(), verifyToken);
        logger.info("Đã gửi mã xác thực tới: {}", user.getEmail_user());
        userRepository.save(user);
    }

    @Override
    public boolean verifyCode(String email, String code) {
        Optional<User> userOpt = userRepository.findByEmail_user(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (code.equals(user.getVerifyToken_user())) {
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
        return userRepository.findByEmail_user(email)
                .filter(user -> Boolean.TRUE.equals(user.getIsActive_user()) &&
                        passwordEncoder.matches(rawPassword, user.getPassword_user()))
                .isPresent();
    }

    @Override
    public UserResponse getUserByEmail(String email) {
        return userRepository.findByEmail_user(email)
                .map(UserResponse::new)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với email: " + email));
    }
}

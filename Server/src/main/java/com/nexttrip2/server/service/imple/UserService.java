package com.nexttrip2.server.service.imple;

import com.nexttrip2.server.dto.ChangePasswordRequestDTO; // ✅ IMPORT DTO
import com.nexttrip2.server.model.User;
import com.nexttrip2.server.repository.UserRepository;
import com.nexttrip2.server.responses.UserResponse;
import com.nexttrip2.server.service.IUserService;

import java.security.SecureRandom;
import java.util.Date;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements IUserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private static final String DEFAULT_AVATAR = "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";

    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @Override
    public void register(User user) {
        if (user.getEmail_user() == null || user.getEmail_user().isEmpty()) {
            throw new IllegalArgumentException("Bạn phải nhập email.");
        }

        if (user.getUsername_user() == null || user.getUsername_user().isEmpty()) {
            throw new IllegalArgumentException("Username không được để trống.");
        }

        if (user.getPassword_user() == null || user.getPassword_user().isEmpty()) {
            throw new IllegalArgumentException("Mật khẩu không được để trống.");
        }

        if (userRepository.findActiveUserByEmail(user.getEmail_user()).isPresent()) {
            throw new IllegalArgumentException("Email đã được xác minh bởi tài khoản khác.");
        }

        Optional<User> existingUser = userRepository.findByEmail_user(user.getEmail_user());
        if (existingUser.isPresent() && !Boolean.TRUE.equals(existingUser.get().getIsActive_user())) {
            User pendingUser = existingUser.get();
            String newCode = generateOtp();
            pendingUser.setVerifyToken_user(newCode);
            pendingUser.setPassword_user(passwordEncoder.encode(user.getPassword_user()));
            pendingUser.setUsername_user(user.getUsername_user());
            pendingUser.setDisplayName_user(user.getDisplayName_user());
            pendingUser.setBirth_date_user(user.getBirth_date_user());
            pendingUser.setGender_user(user.getGender_user());
            pendingUser.setAvatar_user(user.getAvatar_user() != null ? user.getAvatar_user() : DEFAULT_AVATAR);
            pendingUser.setUpdatedAt_user(new Date());

            emailService.sendVerificationCode(pendingUser.getEmail_user(), newCode);
            userRepository.save(pendingUser);
            logger.info("Đã gửi lại mã xác nhận tới: {}", pendingUser.getEmail_user());
            return;
        }

        user.setPassword_user(passwordEncoder.encode(user.getPassword_user()));
        user.setVerifyToken_user(generateOtp());
        user.setIsActive_user(false);
        user.setCreatedAt_user(new Date());
        user.setUpdatedAt_user(new Date());
        user.setAvatar_user(user.getAvatar_user() != null ? user.getAvatar_user() : DEFAULT_AVATAR);

        emailService.sendVerificationCode(user.getEmail_user(), user.getVerifyToken_user());
        logger.info("Đã gửi mã xác nhận tới email mới: {}", user.getEmail_user());
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
                user.setUpdatedAt_user(new Date());
                userRepository.save(user);
                logger.info("Tài khoản {} đã được xác minh thành công", user.getEmail_user());
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        logger.info("Xác minh OTP cho email: {}", email);
        Optional<User> userOpt = userRepository.findByEmail_user(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (otp.equals(user.getVerifyToken_user())) {
                user.setIsActive_user(true);
                user.setVerifyToken_user(null);
                user.setUpdatedAt_user(new Date());
                userRepository.save(user);
                logger.info("Tài khoản {} đã được xác minh thành công", user.getEmail_user());
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean login(String email, String rawPassword) {
        logger.info("Đăng nhập cho email: {}", email);
        return userRepository.findByEmail_user(email)
                .filter(user -> Boolean.TRUE.equals(user.getIsActive_user()) &&
                        passwordEncoder.matches(rawPassword, user.getPassword_user()))
                .isPresent();
    }

    /**
     * ✅ Authenticate trả về User object
     */
    public User authenticate(String email, String rawPassword) {
        logger.info("Authenticate for email: {}", email);
        return userRepository.findByEmail_user(email)
                .filter(user -> Boolean.TRUE.equals(user.getIsActive_user()) &&
                        passwordEncoder.matches(rawPassword, user.getPassword_user()))
                .orElse(null);
    }

    @Override
    public UserResponse getUserByEmail(String email) {
        return userRepository.findByEmail_user(email)
                .map(UserResponse::new)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với email: " + email));
    }

    /**
     * ✅ Đổi mật khẩu người dùng
     */
    public void changePassword(ChangePasswordRequestDTO request) {
        logger.info("Đổi mật khẩu cho email: {}", request.getEmail());
        Optional<User> userOpt = userRepository.findByEmail_user(request.getEmail());

        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy người dùng với email: " + request.getEmail());
        }

        User user = userOpt.get();

        // Kiểm tra mật khẩu cũ đúng không
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword_user())) {
            throw new IllegalArgumentException("Mật khẩu cũ không đúng.");
        }

        // Mã hóa mật khẩu mới và lưu
        user.setPassword_user(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt_user(new Date());

        userRepository.save(user);
        logger.info("Đổi mật khẩu thành công cho email: {}", user.getEmail_user());
    }

    private String generateOtp() {
        return String.format("%06d", new SecureRandom().nextInt(999999));
    }
}

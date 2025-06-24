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
    private final TwilioService twilioService;  
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private static final String DEFAULT_AVATAR = "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";

    // Tiêm TwilioService qua constructor
    public UserService(UserRepository userRepository, EmailService emailService, TwilioService twilioService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.twilioService = twilioService;  
    }

    @Override
    public void register(User user) throws Exception {
        boolean isEmailSignup = user.getEmail_user() != null && !user.getEmail_user().isEmpty();
        boolean isPhoneSignup = user.getPhone_user() != null && !user.getPhone_user().isEmpty();

        if (!isEmailSignup && !isPhoneSignup) {
            throw new Exception("Bạn phải nhập email hoặc số điện thoại.");
        }

        if (user.getUsername_user() == null || user.getUsername_user().isEmpty()) {
            throw new Exception("Username không được để trống.");
        }

        if (user.getPassword_user() == null || user.getPassword_user().isEmpty()) {
            throw new Exception("Mật khẩu không được để trống.");
        }

        // Xử lý đăng ký qua email
        if (isEmailSignup) {
            if (userRepository.findActiveUserByEmail(user.getEmail_user()).isPresent()) {
                throw new Exception("Email đã được xác minh bởi tài khoản khác.");
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
            user.setIsActive_user(false); // Tài khoản chưa xác minh
            user.setCreatedAt_user(new Date());
            user.setUpdatedAt_user(new Date());
            user.setAvatar_user(user.getAvatar_user() != null ? user.getAvatar_user() : DEFAULT_AVATAR);

            emailService.sendVerificationCode(user.getEmail_user(), user.getVerifyToken_user());
            logger.info("Đã gửi mã xác nhận tới email mới: {}", user.getEmail_user());
            userRepository.save(user);
        }

        // Xử lý đăng ký qua số điện thoại
        if (isPhoneSignup) {
            if (userRepository.findActiveUserByPhone_user(user.getPhone_user()).isPresent()) {
                throw new Exception("Số điện thoại đã được xác minh bởi tài khoản khác.");
            }

            if (userRepository.findActiveUserByUsername(user.getUsername_user()).isPresent()) {
                throw new Exception("Username đã được sử dụng bởi tài khoản xác minh khác.");
            }

            user.setPassword_user(passwordEncoder.encode(user.getPassword_user()));
            user.setIsActive_user(false); // Đặt thành false cho đến khi OTP được xác minh
            user.setVerifyToken_user(generateOtp());  // Lưu mã OTP vào verifyToken_user
            user.setCreatedAt_user(new Date());
            user.setUpdatedAt_user(new Date());
            user.setAvatar_user(user.getAvatar_user() != null ? user.getAvatar_user() : DEFAULT_AVATAR);

            // Gửi OTP qua Twilio
            twilioService.sendOtp(user.getPhone_user());  // Gửi OTP đến số điện thoại

            userRepository.save(user);  // Lưu thông tin người dùng
            logger.info("Đăng ký người dùng mới bằng SĐT: {}", user.getPhone_user());
        }
    }

    @Override
    public boolean verifyCode(String emailOrPhone, String code) {
        // Nếu là email
        if (emailOrPhone.contains("@")) {
            Optional<User> userOpt = userRepository.findByEmail_user(emailOrPhone);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                if (code.equals(user.getVerifyToken_user())) {
                    user.setIsActive_user(true);
                    user.setVerifyToken_user(null); // Clear token after verification
                    user.setUpdatedAt_user(new Date());
                    userRepository.save(user);
                    logger.info("Tài khoản {} đã được xác minh thành công", user.getEmail_user());
                    return true;
                }
            }
        }
        // Nếu là số điện thoại
        else {
            Optional<User> userOpt = userRepository.findByPhone_user(emailOrPhone);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                if (code.equals(user.getVerifyToken_user())) {
                    user.setIsActive_user(true);
                    user.setVerifyToken_user(null); // Clear token after verification
                    user.setUpdatedAt_user(new Date());
                    userRepository.save(user);
                    logger.info("Tài khoản {} đã được xác minh thành công", user.getPhone_user());
                    return true;
                }
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

    private String generateOtp() {
        return String.format("%06d", new SecureRandom().nextInt(999999));
    }
}

package com.nexttrip2.server.service.imple;

import com.nexttrip2.server.dto.UpdateProfileRequestDTO;
import com.nexttrip2.server.dto.ChangePasswordRequestDTO;
import com.nexttrip2.server.model.User;
import com.nexttrip2.server.repository.UserRepository;
import com.nexttrip2.server.responses.UserResponse;
import com.nexttrip2.server.service.IUserService;

import java.security.SecureRandom;
import java.text.SimpleDateFormat;
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
        validateRegisterInput(user);
        Optional<User> existingUser = userRepository.findByEmail_user(user.getEmail_user());

        if (existingUser.isPresent() && !Boolean.TRUE.equals(existingUser.get().getIsActive_user())) {
            resendVerificationForPendingUser(existingUser.get(), user);
            return;
        }

        user.setPassword_user(passwordEncoder.encode(user.getPassword_user()));
        user.setVerifyToken_user(generateOtp());
        user.setIsActive_user(false);
        user.setCreatedAt_user(new Date());
        user.setUpdatedAt_user(new Date());
        user.setAvatar_user(user.getAvatar_user() != null ? user.getAvatar_user() : DEFAULT_AVATAR);

        emailService.sendVerificationCode(user.getEmail_user(), user.getVerifyToken_user());
        userRepository.save(user);
        logger.info("Đã gửi mã xác nhận tới email mới: {}", user.getEmail_user());
    }

    private void validateRegisterInput(User user) {
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
    }

    private void resendVerificationForPendingUser(User pendingUser, User newUser) {
        String newCode = generateOtp();
        pendingUser.setVerifyToken_user(newCode);
        pendingUser.setPassword_user(passwordEncoder.encode(newUser.getPassword_user()));
        pendingUser.setUsername_user(newUser.getUsername_user());
        pendingUser.setDisplayName_user(newUser.getDisplayName_user());
        pendingUser.setBirth_date_user(newUser.getBirth_date_user());
        pendingUser.setGender_user(newUser.getGender_user());
        pendingUser.setAvatar_user(newUser.getAvatar_user() != null ? newUser.getAvatar_user() : DEFAULT_AVATAR);
        pendingUser.setUpdatedAt_user(new Date());

        emailService.sendVerificationCode(pendingUser.getEmail_user(), newCode);
        userRepository.save(pendingUser);
        logger.info("Đã gửi lại mã xác nhận tới: {}", pendingUser.getEmail_user());
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

    public void changePassword(ChangePasswordRequestDTO request) {
        logger.info("Đổi mật khẩu cho email: {}", request.getEmail());
        User user = userRepository.findByEmail_user(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword_user())) {
            throw new IllegalArgumentException("Mật khẩu cũ không đúng.");
        }

        user.setPassword_user(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt_user(new Date());
        userRepository.save(user);
        logger.info("Đổi mật khẩu thành công cho email: {}", user.getEmail_user());
    }

    public void updateProfile(UpdateProfileRequestDTO request) {
        User user = userRepository.findByEmail_user(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với email: " + request.getEmail()));

        user.setDisplayName_user(request.getDisplayName());
        user.setUsername_user(request.getUsername());
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            user.setBirth_date_user(sdf.parse(request.getBirth()));
        } catch (Exception e) {
            throw new IllegalArgumentException("Ngày sinh không hợp lệ. Định dạng: yyyy-MM-dd");
        }
        user.setGender_user(request.getGender());
        user.setUpdatedAt_user(new Date());
        userRepository.save(user);
        logger.info("Cập nhật thông tin thành công cho email: {}", user.getEmail_user());
    }

    public void sendResetOtp(String email) {
        Optional<User> userOpt = userRepository.findByEmail_user(email);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy tài khoản với email này.");
        }

        User user = userOpt.get();
        String otp = generateOtp();

        user.setResetOtp(otp);
        user.setOtpExpiryTime(new Date(System.currentTimeMillis() + 10 * 60 * 1000)); // Hết hạn 10 phút
        userRepository.save(user);

        emailService.sendVerificationCode(email, otp);
        System.out.println("✅ Gửi OTP reset password thành công tới: " + email);
    }


    public void verifyAndResetPassword(String email, String otp, String newPassword) {
        logger.info("Xác minh OTP reset password cho email: {}", email);
        User user = userRepository.findByEmail_user(email)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản."));

        if (user.getResetOtp() == null || !user.getResetOtp().equals(otp)) {
            throw new IllegalArgumentException("OTP không đúng.");
        }
        if (user.getOtpExpiryTime() == null || user.getOtpExpiryTime().before(new Date())) {
            throw new IllegalArgumentException("OTP đã hết hạn.");
        }

        user.setPassword_user(passwordEncoder.encode(newPassword));
        user.setResetOtp(null);
        user.setOtpExpiryTime(null);
        user.setUpdatedAt_user(new Date());
        userRepository.save(user);
        logger.info("Đổi mật khẩu thành công cho email: {}", email);
    }

    private String generateOtp() {
        return String.format("%06d", new SecureRandom().nextInt(999999));
    }
}

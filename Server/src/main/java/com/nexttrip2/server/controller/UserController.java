package com.nexttrip2.server.controller;

import com.nexttrip2.server.dto.UserDTO;
import com.nexttrip2.server.model.User;
import com.nexttrip2.server.repository.UserRepository;
import com.nexttrip2.server.service.ITwilioService;
import com.nexttrip2.server.service.imple.UserService;
import com.nexttrip2.server.responses.UserResponse;
import com.nexttrip2.server.service.imple.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.Date;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ITwilioService twilioService;

    @Autowired
    private EmailService emailService;  // Ensure EmailService is injected

    // ✅ Đăng ký bằng email và mật khẩu
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        try {
            userService.register(user);
            return ResponseEntity.ok("Đăng ký thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi đăng ký: " + e.getMessage());
        }
    }

    // ✅ Đăng nhập bằng email hoặc số điện thoại
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            // Lấy số điện thoại hoặc email từ request
            String phoneOrEmail = (user.getPhone_user() != null) ? user.getPhone_user() : user.getEmail_user();
            String password = user.getPassword_user();  // Mật khẩu người dùng nhập

            // Kiểm tra nếu không có email hoặc số điện thoại hợp lệ
            if (phoneOrEmail == null || phoneOrEmail.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Vui lòng nhập email hoặc số điện thoại.");
            }

            // Kiểm tra nếu là số điện thoại hay email
            Optional<User> existingUser;
            if (phoneOrEmail.contains("@")) { // Nếu là email
                existingUser = userRepository.findByEmail_user(phoneOrEmail);
            } else { // Nếu là số điện thoại
                existingUser = userRepository.findByPhone_user(phoneOrEmail);
            }

            // Kiểm tra nếu người dùng tồn tại và mật khẩu đúng
            if (existingUser.isPresent() && userService.login(existingUser.get().getEmail_user(), password)) {
                User loggedInUser = existingUser.get();

                // Kiểm tra xem tài khoản có được kích hoạt hay không
                if (!loggedInUser.getIsActive_user()) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Tài khoản chưa được kích hoạt.");
                }

                // Tạo UserResponse để trả về thông tin người dùng
                UserResponse userResponse = new UserResponse(loggedInUser);

                return ResponseEntity.ok(userResponse);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai số điện thoại hoặc mật khẩu.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi server: " + e.getMessage());
        }
    }

    // ✅ Xác minh OTP và tạo user nếu chưa cóS
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> payload) {
        String phoneOrEmail = payload.get("phoneOrEmail");
        String code = payload.get("code");  // Mã OTP người dùng nhập vào
        String token = payload.get("token");  // Token gửi qua SMS

        try {
            // Kiểm tra OTP từ Twilio (thay vì gọi từ emailService)
            boolean verified = twilioService.verifyOtp(phoneOrEmail, code);

            if (verified) {
                Optional<User> existingUser;

                // Kiểm tra email hay số điện thoại
                if (phoneOrEmail.contains("@")) { // Nếu là email
                    existingUser = userRepository.findByEmail_user(phoneOrEmail);
                } else { // Nếu là số điện thoại
                    existingUser = userRepository.findByPhone_user(phoneOrEmail);
                }

                if (existingUser.isPresent()) {
                    User user = existingUser.get();

                    // Kiểm tra token và xác thực người dùng
                    if (token != null && token.equals(user.getVerifyToken_user())) {
                        user.setIsActive_user(true);  // Xác minh tài khoản
                        user.setVerifyToken_user(null);  // Xoá token sau khi xác minh
                    } else {
                        user.setIsActive_user(false); // Không kích hoạt tài khoản nếu không có token hợp lệ
                    }

                    user.setUpdatedAt_user(new Date());
                    userRepository.save(user);

                    // Trả về thông tin người dùng nếu xác minh thành công
                    UserDTO userDTO = new UserDTO(
                            user.getUsername_user(),
                            user.getDisplayName_user(),
                            user.getEmail_user(),
                            user.getPhone_user(),
                            user.getBirth_date_user() != null ? user.getBirth_date_user().toString() : null,
                            user.getGender_user()
                    );

                    return ResponseEntity.ok(userDTO);  // Thành công
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Không tìm thấy người dùng với thông tin đã cung cấp.");
                }
            } else {
                // Nếu mã OTP không hợp lệ hoặc đã hết hạn
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mã OTP không hợp lệ hoặc đã hết hạn.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi xác minh OTP: " + e.getMessage());
        }
    }


}

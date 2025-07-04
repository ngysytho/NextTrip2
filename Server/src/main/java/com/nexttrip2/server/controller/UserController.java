package com.nexttrip2.server.controller;

import com.nexttrip2.server.dto.*;
import com.nexttrip2.server.model.User;
import com.nexttrip2.server.responses.*;
import com.nexttrip2.server.service.imple.*;
import com.nexttrip2.server.utils.JwtUtil;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, EmailService emailService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        try {
            userService.register(user);
            return ResponseEntity.ok("Đăng ký thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi đăng ký: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            User authenticatedUser = userService.authenticate(user.getEmail_user(), user.getPassword_user());
            if (authenticatedUser != null) {
                // ✅ Generate token with userId + email
                String token = jwtUtil.generateToken(authenticatedUser.getId(), authenticatedUser.getEmail_user());
                UserResponse userResponse = new UserResponse(authenticatedUser);
                return ResponseEntity.ok(new LoginResponse(token, userResponse));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Sai email hoặc mật khẩu hoặc chưa xác minh.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi server: " + e.getMessage());
        }
    }

    @PostMapping("/send-verification")
    public String sendVerification(@RequestParam String email) {
        String code = String.format("%06d", new Random().nextInt(1000000));
        emailService.sendVerificationCode(email, code);
        return "Đã gửi mã xác nhận đến email: " + email;
    }

    @PostMapping("/verify-code")
    public ResponseEntity<String> verifyCode(@RequestBody VerifyCodeRequestDTO request) {
        boolean verified = userService.verifyCode(request.getEmail(), request.getCode());
        return verified
                ? ResponseEntity.ok("Xác minh thành công!")
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Sai mã hoặc đã hết hạn.");
    }

    @GetMapping("/info")
    public ResponseEntity<?> getUserInfo(@RequestParam String email) {
        try {
            UserResponse userResponse = userService.getUserByEmail(email);
            return ResponseEntity.ok(userResponse);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy người dùng với email: " + email);
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequestDTO request) {
        try {
            userService.changePassword(request);
            return ResponseEntity.ok("Đổi mật khẩu thành công");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi server: " + ex.getMessage());
        }
    }

    @PostMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequestDTO request) {
        try {
            userService.updateProfile(request);
            return ResponseEntity.ok("Cập nhật thông tin thành công");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi server: " + ex.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequestDTO request) {
        System.out.println("🔥 Received forgot-password request with email: " + request.getEmail());
        try {
            userService.sendResetOtp(request.getEmail());
            return ResponseEntity.ok("Đã gửi OTP về email: " + request.getEmail());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi server: " + ex.getMessage());
        }
    }

    @PostMapping("/verify-reset-password")
    public ResponseEntity<?> verifyResetPassword(@RequestBody VerifyResetPasswordRequestDTO request) {
        try {
            userService.verifyAndResetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
            return ResponseEntity.ok("Đổi mật khẩu thành công.");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi server: " + ex.getMessage());
        }
    }
}

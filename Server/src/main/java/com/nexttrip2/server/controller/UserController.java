package com.nexttrip2.server.controller;

import java.util.Map;
import java.util.Random;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nexttrip2.server.model.User;
import com.nexttrip2.server.responses.UserResponse;
import com.nexttrip2.server.service.imple.EmailService;
import com.nexttrip2.server.service.imple.UserService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final EmailService emailService;

    public UserController(UserService userService, EmailService emailService) {
        this.userService = userService;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        try {
            userService.register(user);
            return ResponseEntity.ok("Đăng ký thành công");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi đăng ký: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            User authenticatedUser = userService.authenticate(user.getEmail_user(), user.getPassword_user());
            if (authenticatedUser != null) {
                UserResponse userResponse = new UserResponse(authenticatedUser);
                return ResponseEntity.ok(userResponse);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Sai email hoặc mật khẩu hoặc chưa xác minh.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi server: " + e.getMessage());
        }
    }

    @PostMapping("/send-verification")
    public String sendVerification(@RequestParam String email) {
        String code = String.format("%06d", new Random().nextInt(999999));
        emailService.sendVerificationCode(email, code);
        return "Đã gửi mã xác nhận đến email: " + email;
    }

    @PostMapping("/verify-code")
    public ResponseEntity<String> verifyCode(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String code = payload.get("code");

        boolean verified = userService.verifyCode(email, code);
        if (verified) {
            return ResponseEntity.ok("Xác minh thành công!");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Sai mã hoặc đã hết hạn.");
        }
    }

    @GetMapping("/info")
    public ResponseEntity<?> getUserInfo(@RequestParam String email) {
        try {
            UserResponse userResponse = userService.getUserByEmail(email);
            return ResponseEntity.ok(userResponse);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy người dùng với email: " + email);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi server: " + ex.getMessage());
        }
    }

}

package com.nexttrip2.server.controller;

import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nexttrip2.server.model.User;
import com.nexttrip2.server.repository.UserRepository; // ✅ Thêm để gọi findAll()
import com.nexttrip2.server.responses.UserResponse;
import com.nexttrip2.server.service.imple.EmailService;
import com.nexttrip2.server.service.imple.UserService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository; // ✅ Dùng để lấy danh sách user

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
    public ResponseEntity<String> login(@RequestBody User user) {
        try {
            boolean isAuthenticated = userService.login(user.getEmail_user(), user.getPassword_user());
            if (isAuthenticated) {
                return ResponseEntity.ok("Đăng nhập thành công");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai email hoặc mật khẩu hoặc chưa xác minh.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi server: " + e.getMessage());
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

    // ✅ [DEBUG] API trả về toàn bộ danh sách user trong MongoDB
    // Gọi qua: GET http://localhost:8080/api/users/all
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
    List<User> users = userRepository.findAll();
    System.out.println("Tổng số user lấy được: " + users.size());
    return ResponseEntity.ok(users);
}

}
package com.nexttrip2.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nexttrip2.server.model.User;
import com.nexttrip2.server.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

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

    @GetMapping("/verify")
    public String verify(@RequestParam String token) {
        Boolean ok = userService.verify(token);
        return ok ? "Tài khoản đã xác thực!" : "Token không hợp lệ.";
    }
}

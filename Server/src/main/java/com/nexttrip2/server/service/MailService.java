package com.nexttrip2.server.service;

import org.springframework.stereotype.Service;

@Service
public class MailService {
    public void sendVerificationEmail(String to, String token) {
        // In ra console thay vì gửi mail thật
        System.out.println("Send email to " + to + " with token: " + token);
    }
}

package com.nexttrip2.server.service;

public interface IEmailService {
    void sendVerificationCode(String toEmail, String code);
    
}

package com.nexttrip2.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationCode(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Mã xác thực tài khoản NextTrip");
        message.setText("Mã xác nhận của bạn là: " + code + "\nVui lòng không chia sẻ mã này với bất kỳ ai.");
        mailSender.send(message);
    }
}

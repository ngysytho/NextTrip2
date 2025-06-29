package com.nexttrip2.server.service;

public interface ITwilioService {
    void sendOtp(String phoneNumber);
    boolean verifyOtp(String phoneNumber, String code);
}

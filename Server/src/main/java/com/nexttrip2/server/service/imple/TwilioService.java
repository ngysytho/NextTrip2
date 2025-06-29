package com.nexttrip2.server.service.imple;

import com.nexttrip2.server.service.ITwilioService;
import com.twilio.Twilio;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@ConditionalOnProperty(name = "twilio.enabled", havingValue = "true")
public class TwilioService implements ITwilioService {

    private static final Logger logger = LoggerFactory.getLogger(TwilioService.class);

    @Value("${twilio.accountSid}")
    private String accountSid;

    @Value("${twilio.authToken}")
    private String authToken;

    @Value("${twilio.verifyServiceSid}")
    private String verifyServiceSid;

    // Khởi tạo Twilio với account SID và auth token
    @PostConstruct
    public void init() {
        if (accountSid == null || authToken == null || verifyServiceSid == null) {
            throw new IllegalStateException("Twilio configuration is missing from the application properties.");
        }
        Twilio.init(accountSid, authToken);
        logger.info("Twilio Service Initialized successfully");
    }

    /**
     * Gửi OTP tới số điện thoại qua dịch vụ Twilio Verify.
     * 
     * @param phoneNumber Số điện thoại nhận OTP.
     */
    @Override
    public void sendOtp(String phoneNumber) {
        try {
            // Kiểm tra và đảm bảo số điện thoại có mã quốc gia (E.164 format)
            if (!phoneNumber.startsWith("+")) {
                phoneNumber = "+84" + phoneNumber;  // Thêm mã quốc gia Việt Nam nếu không có
            }

            // Gửi OTP qua dịch vụ Twilio Verify
            Verification verification = Verification.creator(
                    verifyServiceSid,
                    phoneNumber,
                    "sms"
            ).create();

            // Lấy trạng thái của OTP
            String status = verification.getStatus();
            logger.info("Trạng thái gửi OTP cho số {}: {}", phoneNumber, status);

            // Kiểm tra trạng thái OTP
            if ("pending".equals(status)) {
                logger.info("OTP đang chờ xác minh.");
            } else if ("approved".equals(status)) {
                logger.info("OTP đã được xác minh thành công.");
            } else {
                logger.warn("Gửi OTP không thành công cho số {}: Trạng thái {}", phoneNumber, status);
            }
        } catch (Exception e) {
            logger.error("Lỗi khi gửi OTP cho {}: {}", phoneNumber, e.getMessage());
        }
    }

    /**
     * Xác minh OTP do người dùng nhập.
     * 
     * @param phoneNumber Số điện thoại nhận OTP.
     * @param code        Mã OTP người dùng nhập.
     * @return true nếu OTP hợp lệ, false nếu không.
     */
    @Override
    public boolean verifyOtp(String phoneNumber, String code) {
        try {
            // Kiểm tra OTP đã nhập
            VerificationCheck verificationCheck = VerificationCheck.creator(verifyServiceSid)
                    .setTo(phoneNumber)
                    .setCode(code)
                    .create();

            // Trạng thái xác minh OTP
            String status = verificationCheck.getStatus();
            logger.info("Trạng thái xác minh OTP cho số {}: {}", phoneNumber, status);

            // Trả về true nếu OTP hợp lệ
            return "approved".equals(status);
        } catch (Exception e) {
            logger.error("Lỗi xác minh OTP cho số {}: {}", phoneNumber, e.getMessage());
            return false;
        }
    }
}

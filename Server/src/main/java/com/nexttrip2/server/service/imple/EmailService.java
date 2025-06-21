package com.nexttrip2.server.service.imple;

import com.nexttrip2.server.service.IEmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService implements IEmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendVerificationCode(String toEmail, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Xác minh tài khoản NextTrip");

            String htmlContent = """
                <html>
                  <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                      <h2 style="color: #0a66c2;">NextTrip - Xác minh tài khoản</h2>
                      <p>Xin chào,</p>
                      <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>NextTrip</strong>.</p>
                      <p style="margin-bottom: 8px;">Mã xác minh của bạn là:</p>
                      <div style="font-size: 28px; font-weight: bold; color: #e63946; margin-bottom: 16px;">%s</div>
                      <p>Vui lòng không chia sẻ mã này với bất kỳ ai. Mã có hiệu lực trong vòng 10 phút.</p>
                      <hr style="margin: 24px 0;">
                      <p style="font-size: 12px; color: #888;">Email này được gửi tự động bởi hệ thống NextTrip. Vui lòng không trả lời lại.</p>
                    </div>
                  </body>
                </html>
                """.formatted(code);

            helper.setText(htmlContent, true); // true = HTML
            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Không thể gửi email xác minh", e);
        }
    }
}

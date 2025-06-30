package com.nexttrip2.server.utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    // 🔑 Secret key cần đủ dài cho HS512 (~64 bytes). Đừng commit key thật lên GitHub public.
    private final String SECRET_KEY = "mySuperLongSecretKeyThatIsAtLeast64BytesLongForHS512AlgorithmUsage1234567890!";

    public String generateToken(String email) {
        long expirationTime = 1000 * 60 * 60 * 24; // 24 hours

        return Jwts.builder()
                .setSubject(email) // Payload: email user
                .setIssuedAt(new Date()) // Thời gian tạo token
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime)) // Thời gian hết hạn
                .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()), SignatureAlgorithm.HS512) // Ký với key và thuật toán HS512
                .compact(); // Trả về token string
    }
}

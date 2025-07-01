package com.nexttrip2.server.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.SignatureException;

import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    // 🔑 Secret key đủ dài cho HS512 (~64 bytes)
    private final String SECRET_KEY = "mySuperLongSecretKeyThatIsAtLeast64BytesLongForHS512AlgorithmUsage1234567890!";

    /**
     * ✅ Generate token với email
     */
    public String generateToken(String email) {
        long expirationTime = 1000 * 60 * 60 * 24; // 24 hours

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * ✅ Validate token hợp lệ hay không
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException ex) {
            System.out.println("Token đã hết hạn: " + ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            System.out.println("Token không được hỗ trợ: " + ex.getMessage());
        } catch (MalformedJwtException ex) {
            System.out.println("Token không hợp lệ: " + ex.getMessage());
        } catch (SignatureException ex) {
            System.out.println("Chữ ký token không đúng: " + ex.getMessage());
        } catch (IllegalArgumentException ex) {
            System.out.println("Token trống: " + ex.getMessage());
        }
        return false;
    }

    /**
     * ✅ Lấy claims (payload data) từ token
     */
    public Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}

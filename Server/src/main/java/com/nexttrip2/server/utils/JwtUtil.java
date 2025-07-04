package com.nexttrip2.server.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // ✅ Secret key dùng HS256 (minimum 256-bit = 32-char string)
    private final String SECRET = "YourSuperSecretKeyForJwtGeneration123!";
    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 hours

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // ✅ Generate token with userId + email
    public String generateToken(String userId, String email) {
        return Jwts.builder()
                .setSubject(email) // email làm subject
                .claim("userId", userId) // thêm userId claim
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Refresh token dựa trên token cũ
    public String refreshToken(String token) {
        Claims claims = getClaims(token);
        String userId = claims.get("userId", String.class);
        String email = claims.getSubject();

        return generateToken(userId, email);
    }

    // ✅ Validate token
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("❌ Token expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.out.println("❌ Unsupported token: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.out.println("❌ Malformed token: " + e.getMessage());
        } catch (SignatureException e) {
            System.out.println("❌ Invalid signature: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.out.println("❌ Illegal argument token: " + e.getMessage());
        }
        return false;
    }

    // ✅ Get claims from token
    public Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ✅ Get subject (email) from token
    public String getSubject(String token) {
        return getClaims(token).getSubject();
    }

    // ✅ Check if token is expired
    public boolean isTokenExpired(String token) {
        Date expiration = getClaims(token).getExpiration();
        return expiration.before(new Date());
    }
}

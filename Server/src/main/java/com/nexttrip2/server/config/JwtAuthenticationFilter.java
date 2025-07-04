package com.nexttrip2.server.config;

import com.nexttrip2.server.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        logger.info("➡️ JwtFilter checking path: {}", path);

        return path.startsWith("/api/users/") ||
               path.startsWith("/api/places/") ||
               path.startsWith("/api/reviews/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        String userId = null;
        String jwt = null;

        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                jwt = authHeader.substring(7);
                if (jwtUtil.validateToken(jwt)) {
                    Claims claims = jwtUtil.getClaims(jwt);
                    userId = claims.get("userId", String.class);
                    if (userId == null) {
                        userId = claims.getSubject(); // fallback
                    }
                    logger.info("✅ Authenticated userId: {}", userId);
                }
            }

            if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userId, null, authorities);
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

        } catch (Exception e) {
            logger.error("❌ JWT Filter Error: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}

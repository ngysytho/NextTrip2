package com.nexttrip2.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers(
                        "/api/users/register",
                        "/api/users/login",
                        "/api/users/send-otp",
                        "/api/users/verify-otp",
                        "/api/users/send-verification",
                        "/api/users/verify-code",
                        "/api/users/change-password", // ✅ thêm dòng này
                        "/api/places/**"
                    ).permitAll()

                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

}

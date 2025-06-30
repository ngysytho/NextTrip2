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
                .requestMatchers("/api/users/register").permitAll()
                .requestMatchers("/api/users/login").permitAll()
                .requestMatchers("/api/users/send-otp").permitAll()
                .requestMatchers("/api/users/verify-otp").permitAll()
                .requestMatchers("/api/users/send-verification").permitAll()
                .requestMatchers("/api/users/verify-code").permitAll()
                .requestMatchers("/api/users/change-password").permitAll()
                .requestMatchers("/api/users/update-profile").permitAll()
                .requestMatchers("/api/places/**").permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

}

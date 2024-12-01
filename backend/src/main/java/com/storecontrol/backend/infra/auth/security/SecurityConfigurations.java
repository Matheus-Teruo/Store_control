package com.storecontrol.backend.infra.auth.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfigurations {

  @Autowired
  SecurityFilter securityFilter;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http.csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(req -> {
          req.requestMatchers( "/volunteers/login","/volunteers/signup","/customers/{uuid}").permitAll();

          req.requestMatchers(
              "/customer/finalize",
              "/donations",
              "/purchases",
              "/recharges",
              "/refund",
              "/transaction",
              "/register/{uuid}",
              "/stand/{uuid}",
              "voluntary/{uuid}")
              .hasAnyRole("USER", "MANAGEMENT", "ADMIN");
          req.requestMatchers(HttpMethod.PUT,"/voluntary")
              .hasAnyRole("USER", "MANAGEMENT", "ADMIN");
          req.requestMatchers(HttpMethod.GET,"/products")
              .hasAnyRole("USER", "MANAGEMENT", "ADMIN");

          req.requestMatchers(HttpMethod.POST,"/products")
              .hasAnyRole( "MANAGEMENT", "ADMIN");
          req.requestMatchers(HttpMethod.PUT,"/products")
              .hasAnyRole( "MANAGEMENT", "ADMIN");
          req.requestMatchers(HttpMethod.DELETE,"/products")
              .hasAnyRole( "MANAGEMENT", "ADMIN");

          req.requestMatchers("/**").hasAnyRole("ADMIN");

        }).addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
        .build();
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
    return configuration.getAuthenticationManager();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}

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

          req.requestMatchers(HttpMethod.GET,
              "/products").permitAll();
          req.requestMatchers(HttpMethod.POST,
              "/user/login", "/user/signup", "/customers/card").permitAll();

          req.requestMatchers(HttpMethod.GET,
                  AUTHORIZED_GET_ENDPOINTS_LOGGED)
              .hasAnyRole( "USER", "MANAGEMENT", "ADMIN");
          req.requestMatchers(HttpMethod.POST,
                  AUTHORIZED_POST_ENDPOINTS_LOGGED)
              .hasAnyRole( "USER", "MANAGEMENT", "ADMIN");
          req.requestMatchers(HttpMethod.PUT,
                  AUTHORIZED_PUT_ENDPOINTS_LOGGED)
              .hasAnyRole( "MANAGEMENT", "ADMIN");
          req.requestMatchers(HttpMethod.DELETE,
                  AUTHORIZED_DELETE_ENDPOINTS_LOGGED)
              .hasAnyRole( "USER", "MANAGEMENT", "ADMIN");


          req.requestMatchers(HttpMethod.GET,
                  AUTHORIZED_GET_ENDPOINTS_MANAGEMENT)
              .hasAnyRole( "MANAGEMENT", "ADMIN");
          req.requestMatchers(HttpMethod.POST,
                  AUTHORIZED_POST_ENDPOINTS_MANAGEMENT)
              .hasAnyRole( "MANAGEMENT", "ADMIN");
          req.requestMatchers(HttpMethod.PUT,
                  AUTHORIZED_PUT_ENDPOINTS_MANAGEMENT)
              .hasAnyRole( "MANAGEMENT", "ADMIN");
          req.requestMatchers(HttpMethod.DELETE,
                  AUTHORIZED_DELETE_ENDPOINTS_MANAGEMENT)
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

  private static final String[] AUTHORIZED_GET_ENDPOINTS_LOGGED = {
      "/user/check",
      "/stands",
      "/stands/{uuid}",
      "/purchases/last3",
      "/purchases/{uuid}",
      "/recharges/last3",
      "/transactions/last3",
      "/volunteers/{uuid}"
  };

  private static final String[] AUTHORIZED_POST_ENDPOINTS_LOGGED = {
      "/user/logout",
      "/customers/finalize",
      "/purchases",
      "/recharges"
  };

  private static final String[] AUTHORIZED_PUT_ENDPOINTS_LOGGED = {
      "/purchases",
      "/volunteers"
  };

  private static final String[] AUTHORIZED_DELETE_ENDPOINTS_LOGGED = {
      "/customers/finalize",
      "/purchases",
      "/recharges"
  };

  private static final String[] AUTHORIZED_GET_ENDPOINTS_MANAGEMENT = {
      "/volunteers",
      "/purchase"
  };

  private static final String[] AUTHORIZED_POST_ENDPOINTS_MANAGEMENT = {
      "/volunteers/function",
      "/products",
      "/transactions"
  };

  private static final String[] AUTHORIZED_PUT_ENDPOINTS_MANAGEMENT = {
      "/products"
  };

  private static final String[] AUTHORIZED_DELETE_ENDPOINTS_MANAGEMENT = {
      "/products",
      "/transactions"
  };
}

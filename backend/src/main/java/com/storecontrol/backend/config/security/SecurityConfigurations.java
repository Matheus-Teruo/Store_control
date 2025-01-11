package com.storecontrol.backend.config.security;

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
  private SecurityFilter securityFilter;

  @Autowired
  private CustomAuthenticationEntryPoint authenticationEntryPoint;

  @Autowired
  private CustomAccessDeniedHandler accessDeniedHandler;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http.csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .exceptionHandling(ex -> {
          ex.authenticationEntryPoint(authenticationEntryPoint);
          ex.accessDeniedHandler(accessDeniedHandler);
        })
        .authorizeHttpRequests(req -> {

          req.requestMatchers(HttpMethod.GET,
              AUTHORIZED_GET_ENDPOINTS_ALL).permitAll();
          req.requestMatchers(HttpMethod.POST,
              AUTHORIZED_POST_ENDPOINTS_ALL).permitAll();
          req.requestMatchers(HttpMethod.OPTIONS,
              "/**").permitAll();

          req.requestMatchers(HttpMethod.GET,
                  AUTHORIZED_GET_ENDPOINTS_LOGGED)
              .hasAnyRole( "USER", "MANAGEMENT", "ADMIN");
          req.requestMatchers(HttpMethod.POST,
                  AUTHORIZED_POST_ENDPOINTS_LOGGED)
              .hasAnyRole( "USER", "MANAGEMENT", "ADMIN");
          req.requestMatchers(HttpMethod.PUT,
                  AUTHORIZED_PUT_ENDPOINTS_LOGGED)
              .hasAnyRole(  "USER", "MANAGEMENT", "ADMIN");
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

          req.requestMatchers("/**").hasRole("ADMIN");

        })
        .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
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

  private static final String[] AUTHORIZED_GET_ENDPOINTS_ALL = {
      "/products",
      "/products/list",
      "/products/{uuid}",
      "/stands/list",
      "/customers/card/{cardId}"
  };

  private static final String[] AUTHORIZED_POST_ENDPOINTS_ALL = {
      "/user/login",
      "/user/signup"
  };

  private static final String[] AUTHORIZED_GET_ENDPOINTS_LOGGED = {
      "/user/check",
      "/stands/{uuid}",
      "/purchases/last3",
      "/purchases/{uuid}",
      "/recharges/last3",
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
      "/purchase",
      "/transactions/last3",
  };

  private static final String[] AUTHORIZED_POST_ENDPOINTS_MANAGEMENT = {
      "/products",
      "/products/upload-image/{uuid}",
      "/transactions"
  };

  private static final String[] AUTHORIZED_PUT_ENDPOINTS_MANAGEMENT = {
      "/volunteers/function",
      "/products"
  };

  private static final String[] AUTHORIZED_DELETE_ENDPOINTS_MANAGEMENT = {
      "/products",
      "/transactions"
  };
}

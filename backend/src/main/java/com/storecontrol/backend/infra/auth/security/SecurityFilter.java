package com.storecontrol.backend.infra.auth.security;

import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.repositories.volunteers.VoluntaryRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
public class SecurityFilter extends OncePerRequestFilter {

  @Autowired
  TokenServiceConfig service;

  @Autowired
  VoluntaryRepository repository;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    String path = request.getRequestURI();
    if (isPublicRoute(path)) {
      filterChain.doFilter(request, response);
      return;
    }

    var tokenJWT = recoverToken(request);

    if (tokenJWT != null) {
      var userUuid = service.recoverVoluntaryUuid(tokenJWT);
      request.setAttribute("UserUuid", userUuid);
      Optional<Voluntary> user = repository.findByUuidValidTrue(userUuid);

      if (user.isPresent()){
        var authentication = new UsernamePasswordAuthenticationToken(
            user.get(),
            null,
            user.get().getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
      }
    }
    filterChain.doFilter(request, response);
  }

  private String recoverToken(HttpServletRequest request) {
    if (request.getCookies() != null) {
      for (Cookie cookie : request.getCookies()) {
        if ("auth".equals(cookie.getName())) {
          return cookie.getValue().trim();
        }
      }
    }

    return null;
  }

  private static final List<String> PUBLIC_ROUTES = List.of(
      "/user/login",
      "/user/signup",
      "/customers/"
  );

  private boolean isPublicRoute(String path) {
    return PUBLIC_ROUTES.stream().anyMatch(path::startsWith);
  }
}

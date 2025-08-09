package com.storecontrol.backend.controllers.volunteers;

import com.storecontrol.backend.config.security.TokenServiceConfig;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.models.volunteers.request.RequestLoginVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestSignupVoluntary;
import com.storecontrol.backend.models.volunteers.response.ResponseUser;
import com.storecontrol.backend.models.volunteers.response.ResponseVoluntary;
import com.storecontrol.backend.services.volunteers.VoluntaryService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("user")
public class AuthController {

  @Autowired
  private AuthenticationManager manager;

  @Autowired
  private TokenServiceConfig tokenService;

  @Autowired
  private VoluntaryService service;

  @PostMapping("/signup")
  public ResponseEntity<ResponseVoluntary> signup(
      @RequestBody @Valid
      RequestSignupVoluntary request,
      HttpServletResponse response) {
    var voluntary = service.createVoluntary(request);

    var authenticationToken = new UsernamePasswordAuthenticationToken(request.username(), request.password());
    var authentication = manager.authenticate(authenticationToken);

    var tokenJWT = tokenService.generateToken((Voluntary) authentication.getPrincipal());

    response.addCookie(createCookie(tokenJWT, 24));

    URI location = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .path("/{uuid}")
        .buildAndExpand(voluntary.getUuid())
        .toUri();

    return ResponseEntity.created(location).body(new ResponseVoluntary(voluntary));
  }

  @PostMapping("/login")
  public ResponseEntity<ResponseUser> login(
      @RequestBody @Valid
      RequestLoginVoluntary request,
      HttpServletResponse response) {
    var authenticationToken = new UsernamePasswordAuthenticationToken(request.username(), request.password());
    var authentication = manager.authenticate(authenticationToken);

    var tokenJWT = tokenService.generateToken((Voluntary) authentication.getPrincipal());

    response.addCookie(createCookie(tokenJWT, 24));

    return ResponseEntity.ok(new ResponseUser((Voluntary) authentication.getPrincipal()));
  }

  @GetMapping("/check")
  public ResponseEntity<ResponseUser> user(HttpServletRequest request) {
    Voluntary voluntary = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    return ResponseEntity.ok(new ResponseUser(voluntary));
  }

  @PostMapping("/logout")
  public ResponseEntity<Void> logout(HttpServletResponse response) {
    response.addCookie(createCookie("", 0));

    return ResponseEntity.noContent().build();
  }

  private Cookie createCookie(String tokenJWT, int hours) {
    Cookie authCookie = new Cookie("auth", tokenJWT);
    authCookie.setHttpOnly(true);
    authCookie.setSecure(true);
    authCookie.setPath("/");
    authCookie.setMaxAge(60 * 60 * hours);
    authCookie.setAttribute("SameSite", "None");
    return authCookie;
  }
}

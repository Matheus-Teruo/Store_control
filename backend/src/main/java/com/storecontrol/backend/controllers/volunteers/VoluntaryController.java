package com.storecontrol.backend.controllers.volunteers;

import com.storecontrol.backend.infra.auth.security.TokenServiceConfig;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.models.volunteers.request.RequestRoleVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestSignupVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestLoginVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestUpdateVoluntary;
import com.storecontrol.backend.models.volunteers.response.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.volunteers.response.ResponseVoluntary;
import com.storecontrol.backend.services.volunteers.VoluntaryService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("volunteers")
public class VoluntaryController {

  @Autowired
  AuthenticationManager manager;

  @Autowired
  TokenServiceConfig tokenService;

  @Autowired
  VoluntaryService service;

  @PostMapping("/signup")
  public ResponseEntity<ResponseVoluntary> signup(
      @RequestBody @Valid
      RequestSignupVoluntary request,
      HttpServletResponse response) {
    var voluntary = service.createVoluntary(request);

    var authenticationToken = new UsernamePasswordAuthenticationToken(request.username(), request.password());
    var authentication = manager.authenticate(authenticationToken);

    var tokenJWT = tokenService.generateToken((Voluntary) authentication.getPrincipal());

    response.addCookie(createCookie(tokenJWT));

    URI location = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .path("/{uuid}")
        .buildAndExpand(voluntary.getUuid())
        .toUri();

    return ResponseEntity.created(location).body(new ResponseVoluntary(voluntary));
  }

  @PostMapping("/login")
  public ResponseEntity<ResponseVoluntary> login(
      @RequestBody @Valid
      RequestLoginVoluntary request,
      HttpServletResponse response) {
    var authenticationToken = new UsernamePasswordAuthenticationToken(request.username(), request.password());
    var authentication = manager.authenticate(authenticationToken);

    var tokenJWT = tokenService.generateToken((Voluntary) authentication.getPrincipal());

    response.addCookie(createCookie(tokenJWT));

    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseVoluntary> readVoluntary(@PathVariable UUID uuid) {
    var response = new ResponseVoluntary(service.takeVoluntaryByUuid(uuid));

    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseSummaryVoluntary>> readVolunteers() {
    var volunteers = service.listVolunteers();

    var response = volunteers.stream().map(ResponseSummaryVoluntary::new).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponseVoluntary> updateVoluntary(@RequestBody @Valid RequestUpdateVoluntary request) {
    var response = new ResponseVoluntary(service.updateVoluntary(request));

    return ResponseEntity.ok(response);
  }

  @PutMapping("/superuser")
  public ResponseEntity<ResponseVoluntary> updateVoluntaryRole(@RequestBody @Valid RequestRoleVoluntary request) {
    var response = new ResponseVoluntary(service.updateVoluntaryRole(request));

    return ResponseEntity.ok(response);
  }

  @DeleteMapping
  public ResponseEntity<Void> deleteVoluntary(@RequestBody @Valid RequestUpdateVoluntary request) {
    service.deleteVoluntary(request);

    return ResponseEntity.noContent().build();
  }

  private Cookie createCookie(String tokenJWT) {
    Cookie authCookie = new Cookie("auth", tokenJWT);
    authCookie.setHttpOnly(true);
    authCookie.setSecure(true);
    authCookie.setPath("/");
    authCookie.setMaxAge(60 * 60 * 24);
    return authCookie;
  }
}

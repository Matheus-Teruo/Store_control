package com.storecontrol.backend.controllers.volunteers;

import com.storecontrol.backend.BaseTest;
import com.storecontrol.backend.config.security.TokenServiceConfig;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.models.volunteers.request.RequestLoginVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestSignupVoluntary;
import com.storecontrol.backend.models.volunteers.response.ResponseUser;
import com.storecontrol.backend.models.volunteers.response.ResponseVoluntary;
import com.storecontrol.backend.services.volunteers.VoluntaryService;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AuthTest extends BaseTest {

  @MockBean
  VoluntaryService service;

  @MockBean
  AuthenticationManager manager;

  @MockBean
  TokenServiceConfig tokenService;

  @Test
  void testSignUpSuccess() throws Exception {
    // Given
    Voluntary mockVoluntary = createVoluntaryEntity(UUID.randomUUID());
    RequestSignupVoluntary requestVoluntary = createRequestSignupVoluntary(mockVoluntary);
    ResponseVoluntary expectedResponse = new ResponseVoluntary(mockVoluntary);
    var authenticationToken = new UsernamePasswordAuthenticationToken(requestVoluntary.username(), requestVoluntary.password());

    when(service.createVoluntary(requestVoluntary)).thenReturn(mockVoluntary);

    var mockAuthentication = mock(Authentication.class);
    when(mockAuthentication.getPrincipal()).thenReturn(mockVoluntary);
    when(manager.authenticate(authenticationToken)).thenReturn(mockAuthentication);

    String mockTokenJWT = "mocked-jwt-token";
    when(tokenService.generateToken(mockVoluntary)).thenReturn(mockTokenJWT);

    // When & Then
    mockMvc.perform(post("/user/signup")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(requestVoluntary)))
        .andExpect(status().isCreated())
        .andExpect(header().string("Location",
            containsString("/user/signup/" + mockVoluntary.getUuid().toString())))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).createVoluntary(requestVoluntary);
    verify(manager, times(1)).authenticate(authenticationToken);
    verify(tokenService, times(1)).generateToken(mockVoluntary);
    verifyNoMoreInteractions(service);
    verifyNoMoreInteractions(manager);
    verifyNoMoreInteractions(tokenService);
  }

  @Test
  void testLoginSuccess() throws Exception {
    // Given
    Voluntary mockVoluntary = createVoluntaryEntity(UUID.randomUUID());
    RequestLoginVoluntary requestVoluntary = createRequestLoginVoluntary(mockVoluntary);
    var authenticationToken = new UsernamePasswordAuthenticationToken(requestVoluntary.username(), requestVoluntary.password());
    ResponseUser expectedResponse = new ResponseUser(mockVoluntary);

    var mockAuthentication = mock(Authentication.class);
    when(mockAuthentication.getPrincipal()).thenReturn(mockVoluntary);
    when(manager.authenticate(authenticationToken)).thenReturn(mockAuthentication);

    String mockTokenJWT = "mocked-jwt-token";
    when(tokenService.generateToken(mockVoluntary)).thenReturn(mockTokenJWT);

    // When & Then
    mockMvc.perform(post("/user/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(requestVoluntary)))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(manager, times(1)).authenticate(authenticationToken);
    verify(tokenService, times(1)).generateToken(mockVoluntary);
    verifyNoMoreInteractions(manager);
    verifyNoMoreInteractions(tokenService);
  }

  @Test
  void testUserCheckSuccess() throws Exception {
    // Given
    String mockJwt = "mocked-jwt-token";
    UUID mockUserUuid = UUID.randomUUID();

    Voluntary mockVoluntary = createVoluntaryEntity(mockUserUuid);
    ResponseUser expectedResponse = new ResponseUser(mockVoluntary);

    Cookie authCookie = new Cookie("auth", mockJwt);

    when(tokenService.recoverVoluntaryUuid(mockJwt)).thenReturn(mockUserUuid);
    when(service.safeTakeVoluntaryByUuid(mockUserUuid)).thenReturn(mockVoluntary);

    // When & Then
    mockMvc.perform(get("/user/check")
            .cookie(authCookie))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(tokenService, times(1)).recoverVoluntaryUuid(mockJwt);
    verify(service, times(1)).safeTakeVoluntaryByUuid(mockUserUuid);
    verifyNoMoreInteractions(tokenService);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testLogoutSuccess() throws Exception {
    // Given
    String mockJwt = "mocked-jwt-token";
    Cookie authCookie = new Cookie("auth", mockJwt);

    // When & Then
    mockMvc.perform(post("/user/logout")
            .cookie(authCookie))
        .andExpect(status().isNoContent())
        .andExpect(cookie().value("auth", ""))
        .andExpect(cookie().maxAge("auth", 0));

    // Verify interactions
    verifyNoMoreInteractions(tokenService);
    verifyNoMoreInteractions(service);
    verifyNoMoreInteractions(manager);
  }
}
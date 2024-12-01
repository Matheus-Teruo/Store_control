package com.storecontrol.backend.controllers.volunteers;

import com.storecontrol.backend.BaseControllerTest;
import com.storecontrol.backend.infra.auth.security.TokenServiceConfig;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.models.volunteers.request.RequestLoginVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestSignupVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestUpdateVoluntary;
import com.storecontrol.backend.models.volunteers.response.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.volunteers.response.ResponseVoluntary;
import com.storecontrol.backend.services.volunteers.VoluntaryService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class VoluntaryControllerTest extends BaseControllerTest {

  @MockBean
  VoluntaryService service;

  @MockBean
  AuthenticationManager manager;

  @MockBean
  TokenServiceConfig tokenService;

  @Test
  void testSignUpVoluntarySuccess() throws Exception {
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

    // When
    String jsonResponse = performPostCreate("volunteers/signup", requestVoluntary, mockVoluntary.getUuid());

    // Then
    ResponseVoluntary actualResponse = fromJson(jsonResponse, ResponseVoluntary.class);
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).createVoluntary(requestVoluntary);
    verify(manager, times(1)).authenticate(authenticationToken);
    verify(tokenService, times(1)).generateToken(mockVoluntary);
    verifyNoMoreInteractions(service);
    verifyNoMoreInteractions(manager);
    verifyNoMoreInteractions(tokenService);
  }

  @Test
  void testLoginVoluntarySuccess() throws Exception {
    // Given
    Voluntary mockVoluntary = createVoluntaryEntity(UUID.randomUUID());
    RequestLoginVoluntary requestVoluntary = createRequestLoginVoluntary(mockVoluntary);
    var authenticationToken = new UsernamePasswordAuthenticationToken(requestVoluntary.username(), requestVoluntary.password());

    var mockAuthentication = mock(Authentication.class);
    when(mockAuthentication.getPrincipal()).thenReturn(mockVoluntary);
    when(manager.authenticate(authenticationToken)).thenReturn(mockAuthentication);

    String mockTokenJWT = "mocked-jwt-token";
    when(tokenService.generateToken(mockVoluntary)).thenReturn(mockTokenJWT);

    // When & Then
    mockMvc.perform(post("/volunteers/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(requestVoluntary)))
        .andExpect(status().isNoContent());

    // Verify interactions
    verify(manager, times(1)).authenticate(authenticationToken);
    verify(tokenService, times(1)).generateToken(mockVoluntary);
    verifyNoMoreInteractions(manager);
    verifyNoMoreInteractions(tokenService);
  }

  @Test
  void testReadVoluntarySuccess() throws Exception {
    // Given
    UUID voluntaryUuid = UUID.randomUUID();
    Voluntary mockVoluntary = createVoluntaryEntity(voluntaryUuid);
    ResponseVoluntary expectedResponse = new ResponseVoluntary(mockVoluntary);

    when(service.takeVoluntaryByUuid(voluntaryUuid)).thenReturn(mockVoluntary);

    // When
    String jsonResponse = performGetWithVariablePath("volunteers", voluntaryUuid);

    // Then
    ResponseVoluntary actualResponse = fromJson(jsonResponse, ResponseVoluntary.class);
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).takeVoluntaryByUuid(voluntaryUuid);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadVolunteersSuccess() throws Exception {
    // Given
    List<Voluntary> mockVolunteers = List.of(
        createVoluntaryEntity(UUID.randomUUID()),
        createVoluntaryEntity(UUID.randomUUID())
    );
    List<ResponseSummaryVoluntary> expectedResponse = mockVolunteers.stream()
        .map(ResponseSummaryVoluntary::new)
        .toList();

    when(service.listVolunteers()).thenReturn(mockVolunteers);

    // When
    String jsonResponse = performGetList("volunteers")
        .andExpect(jsonPath("$.length()").value(2))
        .andReturn().getResponse().getContentAsString();

    // Then
    List<ResponseSummaryVoluntary> actualResponse = List.of(fromJson(jsonResponse, ResponseSummaryVoluntary[].class));
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).listVolunteers();
    verifyNoMoreInteractions(service);
  }

  @Test
  void testUpdateVoluntarySuccess() throws Exception {
    // Given
    Voluntary mockVoluntary = createVoluntaryEntity(UUID.randomUUID());
    RequestUpdateVoluntary updateRequest = createRequestUpdateVoluntary(mockVoluntary.getUuid(), UUID.randomUUID());

    mockVoluntary.updateVoluntary(updateRequest);
    ResponseVoluntary expectedResponse = new ResponseVoluntary(mockVoluntary);

    when(service.updateVoluntary(updateRequest)).thenReturn(mockVoluntary);

    // When
    String jsonResponse = performPut("volunteers", updateRequest);

    // Then
    ResponseVoluntary actualResponse = fromJson(jsonResponse, ResponseVoluntary.class);
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).updateVoluntary(updateRequest);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testDeleteVoluntarySuccess() throws Exception {
    // Given
    RequestUpdateVoluntary deleteRequest = createRequestUpdateVoluntary(UUID.randomUUID(), UUID.randomUUID());

    doNothing().when(service).deleteVoluntary(deleteRequest);

    // When & Then
    performDelete("volunteers", deleteRequest);

    // Verify interactions
    verify(service, times(1)).deleteVoluntary(deleteRequest);
    verifyNoMoreInteractions(service);
  }
}
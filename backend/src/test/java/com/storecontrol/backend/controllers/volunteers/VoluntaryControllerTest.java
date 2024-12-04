package com.storecontrol.backend.controllers.volunteers;

import com.storecontrol.backend.BaseControllerTest;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.models.volunteers.request.RequestUpdateVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestUpdateVoluntaryFunction;
import com.storecontrol.backend.models.volunteers.response.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.volunteers.response.ResponseVoluntary;
import com.storecontrol.backend.services.volunteers.VoluntaryService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

class VoluntaryControllerTest extends BaseControllerTest {

  @MockBean
  VoluntaryService service;

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
    RequestUpdateVoluntary updateRequest = createRequestUpdateVoluntary(mockVoluntary.getUuid());

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
  void testUpdateFunctionsFromVoluntarySuccess() throws Exception {
    // Given
    Voluntary mockVoluntary = createVoluntaryEntity(UUID.randomUUID());
    Stand mockStand = createStandEntity(UUID.randomUUID());
    RequestUpdateVoluntaryFunction updateRequest = createRequestUpdateVoluntaryFunction(
        mockVoluntary.getUuid(),
        mockStand.getUuid());

    mockVoluntary.updateVoluntary(mockStand);
    ResponseVoluntary expectedResponse = new ResponseVoluntary(mockVoluntary);

    when(service.updateFunctionFromVoluntary(updateRequest)).thenReturn(mockVoluntary);

    // When
    String jsonResponse = performPut("volunteers/function", updateRequest);

    // Then
    ResponseVoluntary actualResponse = fromJson(jsonResponse, ResponseVoluntary.class);
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).updateFunctionFromVoluntary(updateRequest);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testDeleteVoluntarySuccess() throws Exception {
    // Given
    RequestUpdateVoluntary deleteRequest = createRequestUpdateVoluntary(UUID.randomUUID());

    doNothing().when(service).deleteVoluntary(deleteRequest);

    // When & Then
    performDelete("volunteers", deleteRequest);

    // Verify interactions
    verify(service, times(1)).deleteVoluntary(deleteRequest);
    verifyNoMoreInteractions(service);
  }
}
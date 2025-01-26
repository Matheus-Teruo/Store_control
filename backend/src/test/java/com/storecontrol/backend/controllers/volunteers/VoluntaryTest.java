package com.storecontrol.backend.controllers.volunteers;

import com.storecontrol.backend.BaseTest;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.models.volunteers.request.RequestVoluntaryRole;
import com.storecontrol.backend.models.volunteers.request.RequestUpdateVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestUpdateVoluntaryFunction;
import com.storecontrol.backend.models.volunteers.response.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.volunteers.response.ResponseVoluntary;
import com.storecontrol.backend.services.volunteers.VoluntaryService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class VoluntaryTest extends BaseTest {

  @MockBean
  VoluntaryService service;

  @Test
  void testReadVoluntarySuccess() throws Exception {
    // Given
    UUID voluntaryUuid = UUID.randomUUID();
    Voluntary mockVoluntary = createVoluntaryEntity(voluntaryUuid);
    ResponseVoluntary expectedResponse = new ResponseVoluntary(mockVoluntary);

    when(service.takeVoluntaryByUuid(voluntaryUuid, voluntaryUuid)).thenReturn(mockVoluntary);

    // When & Then
    mockMvc.perform(get("/volunteers/{uuid}", voluntaryUuid)
            .accept(MediaType.APPLICATION_JSON)
            .requestAttr("UserUuid", voluntaryUuid))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).takeVoluntaryByUuid(voluntaryUuid, voluntaryUuid);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadVolunteersSuccess() throws Exception {
    // Given
    List<Voluntary> mockVolunteers = List.of(
        createVoluntaryEntity(UUID.randomUUID()),
        createVoluntaryEntity(UUID.randomUUID())
    );
    Page<Voluntary> mockPage = new PageImpl<>(mockVolunteers);
    Page<ResponseSummaryVoluntary> expectedResponse = mockPage
        .map(ResponseSummaryVoluntary::new);

    when(service.pageVolunteers(any(Pageable.class))).thenReturn(mockPage);

    // When & Then
    mockMvc.perform(get("/volunteers")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).pageVolunteers(any(Pageable.class));
    verifyNoMoreInteractions(service);
  }

  @Test
  void testUpdateVoluntarySuccess() throws Exception {
    // Given
    Voluntary mockVoluntary = createVoluntaryEntity(UUID.randomUUID());
    RequestUpdateVoluntary updateRequest = createRequestUpdateVoluntary(mockVoluntary.getUuid());

    mockVoluntary.updateVoluntary(updateRequest);
    ResponseVoluntary expectedResponse = new ResponseVoluntary(mockVoluntary);

    when(service.updateVoluntary(updateRequest, mockVoluntary.getUuid())).thenReturn(mockVoluntary);

    // When & Then
    mockMvc.perform(put("/volunteers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(updateRequest))
            .requestAttr("UserUuid", mockVoluntary.getUuid()))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).updateVoluntary(updateRequest, mockVoluntary.getUuid());
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

    // When & Then
    mockMvc.perform(put("/volunteers/function")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(updateRequest)))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).updateFunctionFromVoluntary(updateRequest);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testUpdateRoleFromVoluntarySuccess() throws Exception {
    // Given
    String voluntaryRole = "management";

    Voluntary mockVoluntary = createVoluntaryEntity(UUID.randomUUID());
    RequestVoluntaryRole updateRequest = createRequestUpdateVoluntaryRole(
        mockVoluntary.getUuid(),
        voluntaryRole
        );

    mockVoluntary.updateVoluntaryRole(updateRequest);
    ResponseVoluntary expectedResponse = new ResponseVoluntary(mockVoluntary);

    when(service.updateVoluntaryRole(updateRequest)).thenReturn(mockVoluntary);

    // When & Then
    mockMvc.perform(put("/volunteers/role")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(updateRequest)))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).updateVoluntaryRole(updateRequest);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testDeleteVoluntarySuccess() throws Exception {
    // Given
    UUID voluntaryUuid = UUID.randomUUID();

    doNothing().when(service).deleteVoluntary(voluntaryUuid);

    // When & Then
    mockMvc.perform(delete("/volunteers/{uuid}", voluntaryUuid)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNoContent());

    // Verify interactions
    verify(service, times(1)).deleteVoluntary(voluntaryUuid);
    verifyNoMoreInteractions(service);
  }
}
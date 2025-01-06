package com.storecontrol.backend.controllers.stands;

import com.storecontrol.backend.BaseTest;
import com.storecontrol.backend.models.stands.Association;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.stands.request.RequestCreateStand;
import com.storecontrol.backend.models.stands.request.RequestUpdateStand;
import com.storecontrol.backend.models.stands.response.ResponseStand;
import com.storecontrol.backend.models.stands.response.ResponseSummaryStand;
import com.storecontrol.backend.services.stands.StandService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class StandTest extends BaseTest {

  @MockBean
  private StandService service;

  @Test
  void testCreateStandSuccess() throws Exception {
    // Given
    Stand mockStand = createStandEntity(UUID.randomUUID());

    RequestCreateStand requestStand = createRequestCreateStand(mockStand);
    ResponseStand expectedResponse = new ResponseStand(mockStand);

    when(service.createStand(requestStand)).thenReturn(mockStand);

    // When & Then
    mockMvc.perform(post("/stands")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(requestStand)))
        .andExpect(status().isCreated())
        .andExpect(header().string("Location",
            containsString("/stands/" + mockStand.getUuid().toString())))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).createStand(requestStand);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadStandSuccess() throws Exception {
    // Given
    UUID standUuid = UUID.randomUUID();

    Stand mockStand = createStandEntity(standUuid);
    ResponseStand expectedResponse = new ResponseStand(mockStand);

    when(service.takeStandByUuid(standUuid)).thenReturn(mockStand);

    // When & Then
    mockMvc.perform(get("/stands/{uuid}", standUuid)
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).takeStandByUuid(standUuid);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadStandsSuccess() throws Exception {
    // Given
    List<Stand> mockStands = List.of(
        createStandEntity(UUID.randomUUID()),
        createStandEntity(UUID.randomUUID())
    );
    List<ResponseSummaryStand> expectedResponse = mockStands.stream()
        .map(ResponseSummaryStand::new)
        .toList();

    when(service.listStands()).thenReturn(mockStands);

    // When & Then
    mockMvc.perform(get("/stands")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).listStands();
    verifyNoMoreInteractions(service);
  }

  @Test
  void testUpdateStandSuccess() throws Exception {
    // Given
    Stand mockStand = createStandEntity(UUID.randomUUID());

    Association updatedMockAssociation = createAssociationEntity(UUID.randomUUID());
    RequestUpdateStand updateRequest = createRequestUpdateStand(mockStand.getUuid(), updatedMockAssociation.getUuid());

    mockStand.updateStand(updateRequest);
    mockStand.updateStand(updatedMockAssociation);
    ResponseStand expectedResponse = new ResponseStand(mockStand);

    when(service.updateStand(updateRequest)).thenReturn(mockStand);

    // When & Then
    mockMvc.perform(put("/stands")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(updateRequest)))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).updateStand(updateRequest);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testDeleteStandSuccess() throws Exception {
    // Given
    UUID standUuid = UUID.randomUUID();

    doNothing().when(service).deleteStand(standUuid);

    // When & Then
    mockMvc.perform(delete("/stands/{uuid}", standUuid)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNoContent());

    // Verify interactions
    verify(service, times(1)).deleteStand(standUuid);
    verifyNoMoreInteractions(service);
  }
}
package com.storecontrol.backend.controllers.stands;

import com.storecontrol.backend.BaseControllerTest;
import com.storecontrol.backend.models.stands.Association;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.stands.request.RequestCreateStand;
import com.storecontrol.backend.models.stands.request.RequestUpdateStand;
import com.storecontrol.backend.services.stands.StandService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class StandControllerTest extends BaseControllerTest {

  @MockBean
  private StandService service;

  @Test
  void testCreateStand() throws Exception {
    // Given
    Association mockAssociation = createAssociationEntity(UUID.randomUUID());
    Stand mockStand = createStandEntity(UUID.randomUUID(), mockAssociation);

    RequestCreateStand requestStand = createRequestCreateStand(mockAssociation.getUuid());

    when(service.createStand(requestStand)).thenReturn(mockStand);

    // When & Then
    mockMvc.perform(post("/stands")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(requestStand)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.uuid").value(mockStand.getUuid().toString()))
        .andExpect(jsonPath("$.stand").value(mockStand.getFunctionName()))
        .andExpect(jsonPath("$.association.uuid").value(mockAssociation.getUuid().toString()))
        .andExpect(jsonPath("$.association.association").value(mockAssociation.getAssociationName()))
        .andExpect(jsonPath("$.association.principalName").value(mockAssociation.getPrincipalName()));

    // Verify interactions
    verify(service, times(1)).createStand(requestStand);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadStand() throws Exception {
    // Given
    UUID standUuid = UUID.randomUUID();

    Association mockAssociation = createAssociationEntity(UUID.randomUUID());
    Stand mockStand = createStandEntity(standUuid, mockAssociation);

    when(service.takeStandByUuid(standUuid)).thenReturn(mockStand);

    // When & Then
    mockMvc.perform(get("/stands/{uuid}", standUuid)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.uuid").value(mockStand.getUuid().toString()))
        .andExpect(jsonPath("$.stand").value(mockStand.getFunctionName()))
        .andExpect(jsonPath("$.association.uuid").value(mockAssociation.getUuid().toString()))
        .andExpect(jsonPath("$.association.association").value(mockAssociation.getAssociationName()))
        .andExpect(jsonPath("$.association.principalName").value(mockAssociation.getPrincipalName()));

    // Verify interactions
    verify(service, times(1)).takeStandByUuid(standUuid);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadStands() throws Exception {
    // Given
    Association mockAssociation = createAssociationEntity(UUID.randomUUID());
    List<Stand> mockStands = List.of(
        createStandEntity(UUID.randomUUID(), mockAssociation),
        createStandEntity(UUID.randomUUID(), mockAssociation)
    );

    when(service.listStands()).thenReturn(mockStands);

    // When & Then
    mockMvc.perform(get("/stands")
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(jsonPath("$[0].uuid").value(mockStands.get(0).getUuid().toString()))
        .andExpect(jsonPath("$[0].stand").value(mockStands.get(0).getFunctionName()))
        .andExpect(jsonPath("$[1].uuid").value(mockStands.get(1).getUuid().toString()))
        .andExpect(jsonPath("$[1].stand").value(mockStands.get(1).getFunctionName()));

    // Verify interactions
    verify(service, times(1)).listStands();
    verifyNoMoreInteractions(service);
  }

  @Test
  void testUpdateStand() throws Exception {
    // Given
    Association mockAssociation = createAssociationEntity(UUID.randomUUID());
    Stand mockStand = createStandEntity(UUID.randomUUID(), mockAssociation);

    Association updatedMockAssociation = createAssociationEntity(UUID.randomUUID());
    RequestUpdateStand updateRequest = createRequestUpdateStand(mockStand.getUuid(), updatedMockAssociation.getUuid());

    mockStand.updateStand(updateRequest);
    mockStand.updateStand(updatedMockAssociation);

    when(service.updateStand(updateRequest)).thenReturn(mockStand);

    // When & Then
    mockMvc.perform(put("/stands")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(updateRequest)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.uuid").value(mockStand.getUuid().toString()))
        .andExpect(jsonPath("$.stand").value(mockStand.getFunctionName()))
        .andExpect(jsonPath("$.association.uuid").value(updatedMockAssociation.getUuid().toString()))
        .andExpect(jsonPath("$.association.association").value(updatedMockAssociation.getAssociationName()))
        .andExpect(jsonPath("$.association.principalName").value(updatedMockAssociation.getPrincipalName()));

    // Verify interactions
    verify(service, times(1)).updateStand(updateRequest);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testDeleteStand() throws Exception {
    // Given
    RequestUpdateStand deleteRequest = createRequestUpdateStand(UUID.randomUUID(), UUID.randomUUID());

    doNothing().when(service).deleteStand(deleteRequest);

    // When & Then
    mockMvc.perform(delete("/stands")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(deleteRequest)))
        .andExpect(status().isNoContent());

    // Verify interactions
    verify(service, times(1)).deleteStand(deleteRequest);
    verifyNoMoreInteractions(service);
  }
}
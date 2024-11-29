package com.storecontrol.backend.controllers.stands;

import com.storecontrol.backend.BaseControllerTest;
import com.storecontrol.backend.models.stands.Association;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.stands.request.RequestCreateStand;
import com.storecontrol.backend.models.stands.request.RequestUpdateStand;
import com.storecontrol.backend.models.stands.response.ResponseStand;
import com.storecontrol.backend.models.stands.response.ResponseSummaryStand;
import com.storecontrol.backend.services.stands.StandService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

class StandControllerTest extends BaseControllerTest {

  @MockBean
  private StandService service;

  @Test
  void testCreateStand() throws Exception {
    // Given
    Association mockAssociation = createAssociationEntity(UUID.randomUUID());
    Stand mockStand = createStandEntity(UUID.randomUUID(), mockAssociation);

    RequestCreateStand requestStand = createRequestCreateStand(mockAssociation.getUuid());
    ResponseStand expectedResponse = new ResponseStand(mockStand);

    when(service.createStand(requestStand)).thenReturn(mockStand);

    // When
    String jsonResponse = performPostCreate("stands", requestStand, mockStand.getUuid());

    // Then
    ResponseStand actualResponse = fromJson(jsonResponse, ResponseStand.class);
    assertEquals(expectedResponse, actualResponse);

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
    ResponseStand expectedResponse = new ResponseStand(mockStand);

    when(service.takeStandByUuid(standUuid)).thenReturn(mockStand);

    // When
    String jsonResponse = performGetWithVariablePath("stands", standUuid);

    // Then
    ResponseStand actualResponse = fromJson(jsonResponse, ResponseStand.class);
    assertEquals(expectedResponse, actualResponse);

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
    List<ResponseSummaryStand> expectedResponse = mockStands.stream()
        .map(ResponseSummaryStand::new)
        .toList();

    when(service.listStands()).thenReturn(mockStands);

    // When
    String jsonResponse = performGetList("stands")
        .andExpect(jsonPath("$.length()").value(2))
        .andReturn().getResponse().getContentAsString();

    // Then
    List<ResponseSummaryStand> actualResponse = List.of(fromJson(jsonResponse, ResponseSummaryStand[].class));
    assertEquals(expectedResponse, actualResponse);

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
    ResponseStand expectedResponse = new ResponseStand(mockStand);

    when(service.updateStand(updateRequest)).thenReturn(mockStand);

    // When
    String jsonResponse = performPut("stands", updateRequest);

    // Then
    ResponseStand actualResponse = fromJson(jsonResponse, ResponseStand.class);
    assertEquals(expectedResponse, actualResponse);

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
    performDelete("stands", deleteRequest);

    // Verify interactions
    verify(service, times(1)).deleteStand(deleteRequest);
    verifyNoMoreInteractions(service);
  }
}
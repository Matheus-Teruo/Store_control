package com.storecontrol.backend.controllers.stands;

import com.storecontrol.backend.BaseControllerTest;
import com.storecontrol.backend.models.stands.Association;
import com.storecontrol.backend.models.stands.request.RequestCreateAssociation;
import com.storecontrol.backend.models.stands.request.RequestUpdateAssociation;
import com.storecontrol.backend.models.stands.response.ResponseAssociation;
import com.storecontrol.backend.models.stands.response.ResponseSummaryAssociation;
import com.storecontrol.backend.services.stands.AssociationService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

class AssociationControllerTest extends BaseControllerTest {

  @MockBean
  private AssociationService service;

  @Test
  void testCreateAssociationSuccess() throws Exception {
    // Given
    RequestCreateAssociation requestAssociation = createRequestCreateAssociation();
    Association mockAssociation = createAssociationEntity(UUID.randomUUID());
    ResponseAssociation expectedResponse = new ResponseAssociation(mockAssociation);

    when(service.createAssociation(requestAssociation)).thenReturn(mockAssociation);

    // When
    String jsonResponse = performPostCreate("associations", requestAssociation, mockAssociation.getUuid());

    // Then
    ResponseAssociation actualResponse = fromJson(jsonResponse, ResponseAssociation.class);
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).createAssociation(requestAssociation);
    verifyNoMoreInteractions(service);
  }

  @Test
  public void testReadAssociationSuccess() throws Exception {
    // Given
    UUID associationUuid = UUID.randomUUID();
    Association mockAssociation = createAssociationEntity(associationUuid);
    ResponseAssociation expectedResponse = new ResponseAssociation(mockAssociation);

    when(service.takeAssociationByUuid(associationUuid)).thenReturn(mockAssociation);

    // When
    String jsonResponse = performGetWithVariablePath("associations", associationUuid);

    // Then
    ResponseAssociation actualResponse = fromJson(jsonResponse, ResponseAssociation.class);
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).takeAssociationByUuid(associationUuid);
    verifyNoMoreInteractions(service);
  }


  @Test
  void testReadAssociations() throws Exception {
    // Given
    List<Association> mockAssociations = List.of(
        createAssociationEntity(UUID.randomUUID()),
        createAssociationEntity(UUID.randomUUID())
    );
    List<ResponseSummaryAssociation> expectedResponse = mockAssociations.stream()
        .map(ResponseSummaryAssociation::new)
        .toList();

    when(service.listAssociations()).thenReturn(mockAssociations);

    // When
    String jsonResponse = performGetList("associations")
        .andExpect(jsonPath("$.length()").value(2))
        .andReturn().getResponse().getContentAsString();

    // Then
    List<ResponseSummaryAssociation> actualResponse = List.of(fromJson(jsonResponse, ResponseSummaryAssociation[].class));
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).listAssociations();
    verifyNoMoreInteractions(service);
  }

  @Test
  void testUpdateAssociation() throws Exception {
    // Given
    Association mockAssociation = createAssociationEntity(UUID.randomUUID());
    RequestUpdateAssociation updateRequest = createRequestUpdateAssociation(mockAssociation.getUuid());

    mockAssociation.updateAssociation(updateRequest);
    ResponseAssociation expectedResponse = new ResponseAssociation(mockAssociation);

    when(service.updateAssociation(updateRequest)).thenReturn(mockAssociation);

    // When
    String jsonResponse = performPut("associations", updateRequest);

    // Then
    ResponseAssociation actualResponse = fromJson(jsonResponse, ResponseAssociation.class);
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).updateAssociation(updateRequest);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testDeleteAssociation() throws Exception {
    // Given
    RequestUpdateAssociation deleteRequest = createRequestUpdateAssociation(UUID.randomUUID());

    doNothing().when(service).deleteAssociation(deleteRequest);

    // When & Then
    performDelete("associations", deleteRequest);

    // Verify interactions
    verify(service, times(1)).deleteAssociation(deleteRequest);
    verifyNoMoreInteractions(service);
  }
}
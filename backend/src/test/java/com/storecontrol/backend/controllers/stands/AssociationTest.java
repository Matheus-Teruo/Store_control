package com.storecontrol.backend.controllers.stands;

import com.storecontrol.backend.BaseTest;
import com.storecontrol.backend.models.stands.Association;
import com.storecontrol.backend.models.stands.request.RequestCreateAssociation;
import com.storecontrol.backend.models.stands.request.RequestUpdateAssociation;
import com.storecontrol.backend.models.stands.response.ResponseAssociation;
import com.storecontrol.backend.models.stands.response.ResponseSummaryAssociation;
import com.storecontrol.backend.services.stands.AssociationService;
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

class AssociationTest extends BaseTest {

  @MockBean
  private AssociationService service;

  @Test
  void testCreateAssociationSuccess() throws Exception {
    // Given
    Association mockAssociation = createAssociationEntity(UUID.randomUUID());
    RequestCreateAssociation requestAssociation = createRequestCreateAssociation(mockAssociation);
    ResponseAssociation expectedResponse = new ResponseAssociation(mockAssociation);

    when(service.createAssociation(requestAssociation)).thenReturn(mockAssociation);

    // When & Then
    mockMvc.perform(post("/associations")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(requestAssociation)))
        .andExpect(status().isCreated())
        .andExpect(header().string("Location",
            containsString("/associations/" + mockAssociation.getUuid().toString())))
        .andExpect(content().json(toJson(expectedResponse)));

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

    // When & Then
    mockMvc.perform(get("/associations/{uuid}", associationUuid)
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).takeAssociationByUuid(associationUuid);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadAssociationsSuccess() throws Exception {
    // Given
    List<Association> mockAssociations = List.of(
        createAssociationEntity(UUID.randomUUID()),
        createAssociationEntity(UUID.randomUUID())
    );
    List<ResponseSummaryAssociation> expectedResponse = mockAssociations.stream()
        .map(ResponseSummaryAssociation::new)
        .toList();

    when(service.listAssociations()).thenReturn(mockAssociations);

    // When & Then
    mockMvc.perform(get("/associations")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).listAssociations();
    verifyNoMoreInteractions(service);
  }

  @Test
  void testUpdateAssociationSuccess() throws Exception {
    // Given
    Association mockAssociation = createAssociationEntity(UUID.randomUUID());
    RequestUpdateAssociation updateRequest = createRequestUpdateAssociation(mockAssociation.getUuid());

    mockAssociation.updateAssociation(updateRequest);
    ResponseAssociation expectedResponse = new ResponseAssociation(mockAssociation);

    when(service.updateAssociation(updateRequest)).thenReturn(mockAssociation);

    // When & Then
    mockMvc.perform(put("/associations")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(updateRequest)))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).updateAssociation(updateRequest);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testDeleteAssociationSuccess() throws Exception {
    // Given
    RequestUpdateAssociation deleteRequest = createRequestUpdateAssociation(UUID.randomUUID());

    doNothing().when(service).deleteAssociation(deleteRequest);

    // When & Then
    mockMvc.perform(delete("/associations")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(deleteRequest)))
        .andExpect(status().isNoContent());

    // Verify interactions
    verify(service, times(1)).deleteAssociation(deleteRequest);
    verifyNoMoreInteractions(service);
  }
}
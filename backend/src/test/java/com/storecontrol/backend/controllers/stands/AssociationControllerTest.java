package com.storecontrol.backend.controllers.stands;

import com.storecontrol.backend.BaseControllerTest;
import com.storecontrol.backend.models.stands.Association;
import com.storecontrol.backend.models.stands.request.RequestCreateAssociation;
import com.storecontrol.backend.models.stands.request.RequestUpdateAssociation;
import com.storecontrol.backend.services.stands.AssociationService;
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

class AssociationControllerTest extends BaseControllerTest {

  @MockBean
  private AssociationService service;

  @Test
  void testCreateAssociationSuccess() throws Exception {
    // Given
    RequestCreateAssociation request = createRequestCreateAssociation();

    Association mockAssociation = createAssociationEntity(UUID.randomUUID());

    when(service.createAssociation(request)).thenReturn(mockAssociation);

    // When & Then
    mockMvc.perform(post("/associations")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(request)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.uuid").value(mockAssociation.getUuid().toString()))
        .andExpect(jsonPath("$.association").value(mockAssociation.getAssociationName()))
        .andExpect(jsonPath("$.principalName").value(mockAssociation.getPrincipalName()));

    // Verify interactions
    verify(service, times(1)).createAssociation(request);
    verifyNoMoreInteractions(service);
  }

  @Test
  public void testReadAssociationSuccess() throws Exception {
    // Given
    UUID associationUuid = UUID.randomUUID();
    Association mockAssociation = createAssociationEntity(associationUuid);

    when(service.takeAssociationByUuid(associationUuid)).thenReturn(mockAssociation);

    // When & Then
    mockMvc.perform(get("/associations/{uuid}", associationUuid)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.uuid").value(mockAssociation.getUuid().toString()))
        .andExpect(jsonPath("$.association").value(mockAssociation.getAssociationName()))
        .andExpect(jsonPath("$.principalName").value(mockAssociation.getPrincipalName()));

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

    when(service.listAssociations()).thenReturn(mockAssociations);

    // When & Then
    mockMvc.perform(get("/associations")
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(jsonPath("$[0].uuid").value(mockAssociations.get(0).getUuid().toString()))
        .andExpect(jsonPath("$[0].association").value(mockAssociations.get(0).getAssociationName()))
        .andExpect(jsonPath("$[1].uuid").value(mockAssociations.get(1).getUuid().toString()))
        .andExpect(jsonPath("$[1].association").value(mockAssociations.get(1).getAssociationName()));

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

    when(service.updateAssociation(updateRequest)).thenReturn(mockAssociation);

    // When & Then
    mockMvc.perform(put("/associations")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(updateRequest)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.uuid").value(mockAssociation.getUuid().toString()))
        .andExpect(jsonPath("$.association").value(mockAssociation.getAssociationName()))
        .andExpect(jsonPath("$.principalName").value(mockAssociation.getPrincipalName()));

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
    mockMvc.perform(delete("/associations")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(deleteRequest)))
        .andExpect(status().isNoContent());

    // Verify interactions
    verify(service, times(1)).deleteAssociation(deleteRequest);
    verifyNoMoreInteractions(service);
  }
}
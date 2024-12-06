package com.storecontrol.backend.services.stands;

import com.storecontrol.backend.BaseTest;
import com.storecontrol.backend.models.stands.Association;
import com.storecontrol.backend.models.stands.request.RequestCreateAssociation;
import com.storecontrol.backend.models.stands.request.RequestUpdateAssociation;
import com.storecontrol.backend.repositories.stands.AssociationRepository;
import com.storecontrol.backend.services.stands.validation.AssociationValidation;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.*;

class AssociationServiceTest extends BaseTest {

  @MockBean
  AssociationValidation validation;

  @MockBean
  AssociationRepository repository;

  @InjectMocks
  private AssociationService service;

  @Test
  void testCreateAssociationSuccess() {
    // Given
    Association mockAssociation = createAssociationEntity(UUID.randomUUID());
    RequestCreateAssociation requestAssociation = createRequestCreateAssociation(mockAssociation);

    doNothing().when(validation).checkNameDuplication(requestAssociation.associationName());
    when(repository.save(any(Association.class))).thenReturn(mockAssociation);

    // When
    Association result = service.createAssociation(requestAssociation);

    // Then
    assertEquals(mockAssociation.getAssociationName(), result.getAssociationName());
    verify(validation).checkNameDuplication(mockAssociation.getAssociationName());
    then(repository).should().save(any(Association.class));
    verifyNoMoreInteractions(validation, repository);
  }

  @Test
  void testTakeAssociationByUuidSuccess() {
    // Given
    UUID uuid = UUID.randomUUID();
    Association mockAssociation = createAssociationEntity(uuid);

    when(repository.findByUuidValidTrue(uuid)).thenReturn(Optional.of(mockAssociation));

    // When
    Association result = service.takeAssociationByUuid(uuid);

    // Then
    assertEquals(mockAssociation, result);
    then(repository).should().findByUuidValidTrue(uuid);
    verifyNoMoreInteractions(repository);
  }

  @Test
  void testSafeTakeAssociationByUuid() {
    // Given
    UUID uuid = UUID.randomUUID();
    Association mockAssociation = createAssociationEntity(uuid);

    when(repository.findByUuidValidTrue(uuid)).thenReturn(Optional.of(mockAssociation));

    // When
    Association result = service.takeAssociationByUuid(uuid);

    // Then
    assertEquals(mockAssociation, result);
    then(repository).should().findByUuidValidTrue(uuid);
    verifyNoMoreInteractions(repository);
  }

  @Test
  void testListAssociations() {
    // Given
    List<Association> mockAssociations = List.of(
        createAssociationEntity(UUID.randomUUID()),
        createAssociationEntity(UUID.randomUUID())
    );

    when(repository.findAllValidTrue()).thenReturn(mockAssociations);

    // When
    List<Association> result = service.listAssociations();

    // Then
    assertEquals(mockAssociations, result);
    then(repository).should().findAllValidTrue();
    verifyNoMoreInteractions(repository);
  }

  @Test
  void testUpdateAssociation() {
    // Given
    UUID associationUuid = UUID.randomUUID();
    Association mockAssociation = createAssociationEntity(associationUuid);
    RequestUpdateAssociation request = createRequestUpdateAssociation(associationUuid);

    doNothing().when(validation).checkNameDuplication(request.associationName());
    when(repository.findByUuidValidTrue(associationUuid)).thenReturn(Optional.of(mockAssociation));

    // When
    Association result = service.updateAssociation(request);

    // Then
    assertEquals(request.associationName(), result.getAssociationName());
    verify(validation).checkNameDuplication(request.associationName());
    then(repository).should().findByUuidValidTrue(associationUuid);
    verifyNoMoreInteractions(validation, repository);
  }

  @Test
  void testDeleteAssociation() {
    // Given
    UUID uuid = UUID.randomUUID();
    Association mockAssociation = createAssociationEntity(uuid);
    RequestUpdateAssociation request = createRequestUpdateAssociation(uuid);

    when(repository.findByUuidValidTrue(uuid)).thenReturn(Optional.of(mockAssociation));

    // When
    service.deleteAssociation(request);

    // Then
    then(repository).should().findByUuidValidTrue(uuid);
    verifyNoMoreInteractions(repository);
  }
}
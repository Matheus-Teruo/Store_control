package com.storecontrol.backend.services.stands;

import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.stands.request.RequestCreateStand;
import com.storecontrol.backend.models.stands.request.RequestUpdateStand;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.repositories.stands.StandRepository;
import com.storecontrol.backend.services.stands.validation.StandValidation;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class StandService {

  @Autowired
  StandValidation validation;

  @Autowired
  StandRepository repository;

  @Autowired
  AssociationService associationService;

  @Transactional
  public Stand createStand(RequestCreateStand request) {
    validation.checkNameDuplication(request.standName());

    var association = associationService.safeTakeAssociationByUuid(request.associationUuid());
    var stand = new Stand(request, association);
    repository.save(stand);

    return stand;
  }

  public Stand takeStandByUuid(UUID uuid) {
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(EntityNotFoundException::new);
  }

  public Stand safeTakeStandByUuid(UUID uuid) {
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(() -> new InvalidDatabaseQueryException("Non-existent entity", "Stand", uuid.toString()));
  }

  public List<Stand> listStands() {
    return repository.findAllValidTrue();
  }

  @Transactional
  public Stand updateStand(RequestUpdateStand request) {
    validation.checkNameDuplication(request.standName());
    var stand = safeTakeStandByUuid(request.uuid());

    stand.updateStand(request);
    verifyUpdateAssociation(request.associationUuid(), stand);

    return stand;
  }

  @Transactional
  public void deleteStand(RequestUpdateStand request) {
    var stand = safeTakeStandByUuid(request.uuid());

    stand.deleteFunction();
  }

  private void verifyUpdateAssociation(UUID uuid, Stand stand) {
    if (uuid != null) {
      var association = associationService.safeTakeAssociationByUuid(uuid);

      stand.updateStand(association);
    }
  }
}

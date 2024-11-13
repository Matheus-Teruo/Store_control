package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.stand.RequestStand;
import com.storecontrol.backend.controllers.request.stand.RequestUpdateStand;
import com.storecontrol.backend.models.Stand;
import com.storecontrol.backend.repositories.StandRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class StandService {

  @Autowired
  StandRepository repository;

  @Autowired
  AssociationService associationService;

  @Transactional
  public Stand createStand(RequestStand request) {
    var association = associationService.takeAssociationByUuid(request.associationId());
    var stand = new Stand(request, association);
    repository.save(stand);

    return stand;
  }

  public Stand takeStandByUuid(String uuid) {
    var standOptional = repository.findByUuidValidTrue(UUID.fromString(uuid));

    return standOptional.orElseGet(Stand::new);  // TODO: ERROR: stand_uuid invalid
  }

  public List<Stand> listStands() {
    return repository.findAllValidTrue();
  }

  @Transactional
  public Stand updateStand(RequestUpdateStand request) {
    var stand = takeStandByUuid(request.uuid());

    stand.updateStand(request);
    verifyUpdateAssociation(request.associationId(), stand);

    return stand;
  }

  @Transactional
  public void deleteStand(RequestUpdateStand request) {
    var stand = takeStandByUuid(request.uuid());

    stand.deleteStand();
  }

  private void verifyUpdateAssociation(String uuid, Stand stand) {
    if (uuid != null) {
      var association = associationService.takeAssociationByUuid(uuid);

      stand.updateStand(association);
    }
  }
}

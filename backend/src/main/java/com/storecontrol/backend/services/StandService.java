package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.stand.RequestStand;
import com.storecontrol.backend.controllers.request.stand.RequestUpdateStand;
import com.storecontrol.backend.models.Stand;
import com.storecontrol.backend.repositories.StandRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
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

  public Stand takeStand(String uuid) {
    return repository.findByIdValidTrue(UUID.fromString(uuid));
  }

  public List<Stand> listStands() {
    return repository.findAllByValidTrue();
  }

  @Transactional
  public Stand updateStand(RequestUpdateStand request) {
    Optional<Stand> standOptional = repository.findById(UUID.fromString(request.uuid()));

    if (standOptional.isPresent()) {
      var stand = standOptional.get();
      stand.updateStand(request);

      verifyUpdateAssociation(request.associationId(), stand);

      return stand;
    } else {
      // TODO: error: input error field id
      return new Stand();
    }
  }

  @Transactional
  public void deleteStand(RequestUpdateStand request) {
    Optional<Stand> stand = repository.findById(UUID.fromString(request.uuid()));

    stand.ifPresent(Stand::deleteStand);
  }

  private void verifyUpdateAssociation(String uuid, Stand stand) {
    if (uuid != null) {
      var association = associationService.takeAssociationByUuid(uuid);

      stand.updateStand(association);
    }
  }
}

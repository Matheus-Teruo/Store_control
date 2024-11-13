package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.association.RequestAssociation;
import com.storecontrol.backend.controllers.request.association.RequestUpdateAssociation;
import com.storecontrol.backend.models.Association;
import com.storecontrol.backend.repositories.AssociationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AssociationService {

  @Autowired
  AssociationRepository repository;

  @Transactional
  public Association createAssociation(RequestAssociation request) {
    var association = new Association(request);
    repository.save(association);

    return association;
  }

  public Association takeAssociationByUuid(String uuid) {
    var associationOptional = repository.findByIdValidTrue(UUID.fromString(uuid));

    if (associationOptional.isPresent()) {
      return associationOptional.get();
    } else {
      // TODO: ERROR: association_uuid invalid
      return new Association();
    }
  }

  public List<Association> listAssociations() {
    return repository.findAllByValidTrue();
  }

  @Transactional
  public Association updateAssociation(RequestUpdateAssociation request) {
    Optional<Association> associationOptional = repository.findById(UUID.fromString(request.uuid()));

    if (associationOptional.isPresent()) {
      var association = associationOptional.get();
      association.updateAssociation(request);

      return association;
    } else {
      // TODO: error: input error field id
      return new Association();
    }
  }

  @Transactional
  public void deleteAssociation(RequestUpdateAssociation request) {
    Optional<Association> association = repository.findById(UUID.fromString(request.uuid()));

    association.ifPresent(Association::deleteAssociation);
  }
}

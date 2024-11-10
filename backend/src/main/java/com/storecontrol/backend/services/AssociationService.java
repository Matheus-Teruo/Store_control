package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.association.RequestUpdateAssociation;
import com.storecontrol.backend.controllers.response.association.ResponseAssociation;
import com.storecontrol.backend.models.Association;
import com.storecontrol.backend.repositories.AssociationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class AssociationService {

  @Autowired
  AssociationRepository repository;

  @Transactional
  public ResponseAssociation serviceUptadeAssociation(RequestUpdateAssociation request) {
    Optional<Association> association = repository.findById(UUID.fromString(request.uuid()));

    if (association.isPresent()) {
      association.get().updateAssociation(request);
      return new ResponseAssociation(association.get());
    } else {
      return new ResponseAssociation(new Association());
    }
  }

  public void serviceDeleteAssociation(RequestUpdateAssociation request) {
    Optional<Association> association = repository.findById(UUID.fromString(request.uuid()));

    association.ifPresent(Association::deleteAssociation);
  }
}

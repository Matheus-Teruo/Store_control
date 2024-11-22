package com.storecontrol.backend.services.stands;

import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.stands.request.RequestCreateAssociation;
import com.storecontrol.backend.models.stands.request.RequestUpdateAssociation;
import com.storecontrol.backend.models.stands.Association;
import com.storecontrol.backend.repositories.stands.AssociationRepository;
import com.storecontrol.backend.services.stands.validation.AssociationValidation;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AssociationService {

  @Autowired
  AssociationValidation validation;

  @Autowired
  AssociationRepository repository;

  @Transactional
  public Association createAssociation(RequestCreateAssociation request) {
    validation.checkNameDuplication(request.associationName());

    var association = new Association(request);
    repository.save(association);

    return association;
  }

  public Association takeAssociationByUuid(UUID uuid) {
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(EntityNotFoundException::new);
  }

  public Association safeTakeAssociationByUuid(UUID uuid) {
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(() -> new InvalidDatabaseQueryException("Non-existent entity", "Association", uuid.toString()));
  }

  public List<Association> listAssociations() {
    return repository.findAllValidTrue();
  }

  @Transactional
  public Association updateAssociation(RequestUpdateAssociation request) {
    validation.checkNameDuplication(request.associationName());
    var association = safeTakeAssociationByUuid(request.uuid());

    association.updateAssociation(request);

    return association;
  }

  @Transactional
  public void deleteAssociation(RequestUpdateAssociation request) {
    var association = safeTakeAssociationByUuid(request.uuid());

    association.deleteAssociation();
  }
}

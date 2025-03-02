package com.storecontrol.backend.services.stands;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.stands.request.RequestCreateAssociation;
import com.storecontrol.backend.models.stands.request.RequestUpdateAssociation;
import com.storecontrol.backend.models.stands.Association;
import com.storecontrol.backend.repositories.stands.AssociationRepository;
import com.storecontrol.backend.services.stands.validation.AssociationValidation;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    validation.checkKeyDuplication(request.associationKey());

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
        .orElseThrow(() -> new InvalidDatabaseQueryException(
            MessageResolver.getInstance().getMessage("service.exception.association.get.validation.error"),
            MessageResolver.getInstance().getMessage("service.exception.association.get.validation.message"),
            uuid.toString())
        );
  }

  public Association safeTakeAssociationByKey(String key) {
    return repository.findByKeyValidTrue(key)
        .orElseThrow(() -> new InvalidDatabaseQueryException(
            MessageResolver.getInstance().getMessage("service.exception.association.getByKey.validation.error"),
            MessageResolver.getInstance().getMessage("service.exception.association.getByKey.validation.message"),
            key)
        );
  }

  public Page<Association> pageAssociations(Pageable pageable) {
    return repository.findAllValidTruePage(pageable);
  }

  public List<Association> listAssociations() {
    return repository.findAllValidTrue();
  }

  @Transactional
  public Association updateAssociation(RequestUpdateAssociation request) {
    validation.checkNameDuplication(request.associationName());
    validation.checkKeyDuplication(request.associationKey());
    var association = safeTakeAssociationByUuid(request.uuid());

    association.updateAssociation(request);

    return association;
  }

  @Transactional
  public void deleteAssociation(UUID uuid) {
    var association = safeTakeAssociationByUuid(uuid);

    association.deleteAssociation();
  }
}

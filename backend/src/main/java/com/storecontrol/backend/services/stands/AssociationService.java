package com.storecontrol.backend.services.stands;

import com.storecontrol.backend.controllers.stands.request.RequestAssociation;
import com.storecontrol.backend.controllers.stands.request.RequestUpdateAssociation;
import com.storecontrol.backend.models.stands.Association;
import com.storecontrol.backend.repositories.stands.AssociationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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
    var associationOptional = repository.findByUuidValidTrue(UUID.fromString(uuid));

    return associationOptional.orElseGet(Association::new);  // TODO: ERROR: association_uuid invalid
  }

  public List<Association> listAssociations() {
    return repository.findAllValidTrue();
  }

  @Transactional
  public Association updateAssociation(RequestUpdateAssociation request) {
    var association = takeAssociationByUuid(request.uuid());

    association.updateAssociation(request);

    return association;
  }

  @Transactional
  public void deleteAssociation(RequestUpdateAssociation request) {
    var association = takeAssociationByUuid(request.uuid());

    association.deleteAssociation();
  }
}

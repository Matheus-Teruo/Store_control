package com.storecontrol.backend.services.volunteers;

import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.models.volunteers.request.RequestCreateVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestUpdateVoluntary;
import com.storecontrol.backend.repositories.volunteers.VoluntaryRepository;
import com.storecontrol.backend.services.volunteers.validation.VoluntaryValidation;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class VoluntaryService {

  @Autowired
  VoluntaryValidation validation;

  @Autowired
  VoluntaryRepository repository;

  @Autowired
  FunctionService functionService;

  @Transactional
  public Voluntary createVoluntary(RequestCreateVoluntary request) {
    validation.checkNameDuplication(request.username(), request.fullname());
    var voluntary = new Voluntary(request);
    repository.save(voluntary);

    return voluntary;
  }

  public Voluntary takeVoluntaryByUuid(UUID uuid){
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(EntityNotFoundException::new);
  }

  public Voluntary safeTakeVoluntaryByUuid(UUID uuid) {
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(() -> new InvalidDatabaseQueryException("Non-existent entity", "Voluntary", uuid.toString()));
  }

  public List<Voluntary> listVolunteers() {
    return repository.findAllValidTrue();
  }

  @Transactional
  public Voluntary uptadeVoluntary(RequestUpdateVoluntary request) {
    validation.checkNameDuplication(request.username(), request.fullname());
    var voluntary = safeTakeVoluntaryByUuid(request.uuid());

    voluntary.updateVoluntary(request);
    verifyUpdateFunction(request.functionId(), voluntary);

    return voluntary;
  }

  @Transactional
  public void deleteVoluntary(RequestUpdateVoluntary request) {
    var voluntary = safeTakeVoluntaryByUuid(request.uuid());

    voluntary.deleteVoluntary();
  }

  private void verifyUpdateFunction(UUID uuid, Voluntary voluntary) {
    if (uuid != null) {
      var function = functionService.takeFunctionByUuid(uuid);

      voluntary.updateVoluntary(function);
    }
  }
}

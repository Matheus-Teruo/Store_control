package com.storecontrol.backend.services.volunteers;

import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.volunteers.User;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.models.volunteers.request.RequestRoleVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestSignupVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestUpdateVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestUpdateVoluntaryFunction;
import com.storecontrol.backend.repositories.volunteers.VoluntaryRepository;
import com.storecontrol.backend.services.volunteers.validation.VoluntaryValidation;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
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

  @Autowired
  PasswordEncoder passwordEncoder;

  @Transactional
  public Voluntary createVoluntary(RequestSignupVoluntary request) {
    validation.checkNameDuplication(request.username(), request.fullname());
    var user = new User(request.username(), passwordEncoder.encode(request.password()));
    var voluntary = new Voluntary(request, user);
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
  public Voluntary updateVoluntary(RequestUpdateVoluntary request) {
    validation.checkNameDuplication(request.username(), request.fullname());
    var voluntary = safeTakeVoluntaryByUuid(request.uuid());

    voluntary.updateVoluntary(request);

    return voluntary;
  }

  @Transactional
  public Voluntary updateFunctionFromVoluntary(RequestUpdateVoluntaryFunction request) {
    var voluntary = safeTakeVoluntaryByUuid(request.uuid());

    verifyUpdateFunction(request.functionUuid(), voluntary);

    return voluntary;
  }

  @Transactional
  public Voluntary updateVoluntaryRole(RequestRoleVoluntary request) {
    var voluntary = safeTakeVoluntaryByUuid(request.uuid());

    voluntary.updateVoluntaryRole(request);

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

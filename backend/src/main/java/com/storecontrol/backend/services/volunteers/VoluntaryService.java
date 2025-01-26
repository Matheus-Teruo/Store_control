package com.storecontrol.backend.services.volunteers;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.volunteers.User;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.models.volunteers.request.RequestVoluntaryRole;
import com.storecontrol.backend.models.volunteers.request.RequestSignupVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestUpdateVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestUpdateVoluntaryFunction;
import com.storecontrol.backend.repositories.volunteers.VoluntaryRepository;
import com.storecontrol.backend.services.volunteers.validation.VoluntaryValidation;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

  public Voluntary takeVoluntaryByUuid(UUID uuid, UUID voluntaryUuid){
    validation.checkVoluntaryAuthentication(uuid, voluntaryUuid);
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(EntityNotFoundException::new);
  }

  public Voluntary safeTakeVoluntaryByUuid(UUID uuid) {
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(() -> new InvalidDatabaseQueryException(
            MessageResolver.getInstance().getMessage("service.exception.voluntary.get.validation.error"),
            MessageResolver.getInstance().getMessage("service.exception.voluntary.get.validation.message"),
            uuid.toString())
        );
  }

  public Page<Voluntary> pageVolunteers(Pageable pageable) {
    return repository.findAllValidTrue(pageable);
  }

  @Transactional
  public Voluntary updateVoluntary(RequestUpdateVoluntary request, UUID voluntaryUuid) {
    validation.checkVoluntaryAuthentication(request.uuid(), voluntaryUuid);
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
  public Voluntary updateVoluntaryRole(RequestVoluntaryRole request) {
    var voluntary = safeTakeVoluntaryByUuid(request.uuid());

    voluntary.updateVoluntaryRole(request);

    return voluntary;
  }

  @Transactional
  public void deleteVoluntary(UUID uuid) {
    var voluntary = safeTakeVoluntaryByUuid(uuid);

    voluntary.deleteVoluntary();
  }

  private void verifyUpdateFunction(UUID uuid, Voluntary voluntary) {
    if (uuid != null) {
      var function = functionService.takeFunctionByUuid(uuid);

      voluntary.updateVoluntary(function);
    }
  }
}

package com.storecontrol.backend.services.volunteers;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.volunteers.User;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.models.volunteers.request.*;
import com.storecontrol.backend.repositories.volunteers.VoluntaryRepository;
import com.storecontrol.backend.services.stands.AssociationService;
import com.storecontrol.backend.services.volunteers.validation.VoluntaryValidation;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class VoluntaryService {

  private static final String NEW_PASSWORD = "ChangeMe123";

  @Autowired
  private VoluntaryValidation validation;

  @Autowired
  private VoluntaryRepository repository;

  @Autowired
  private AssociationService associationService;

  @Autowired
  private FunctionService functionService;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Transactional
  public Voluntary createVoluntary(RequestSignupVoluntary request) {
    validation.checkNameDuplication(request.username(), request.fullname());
    validation.checkAssociationKey(request.associationKey());
    var associationUuid = associationService.safeTakeAssociationByKey(request.associationKey());
    var user = new User(request.username(), passwordEncoder.encode(request.password()));
    var voluntary = new Voluntary(request, user, associationUuid);
    repository.save(voluntary);

    return voluntary;
  }

  public Voluntary takeVoluntaryByUuid(UUID uuid){
    Voluntary voluntary = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    validation.checkVoluntaryPermission(uuid, voluntary);
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

  public List<Voluntary> listVolunteers() {
    return repository.findAllValidTrue();
  }

  @Transactional
  public Voluntary updateVoluntary(RequestUpdateVoluntary request) {
    var voluntary = safeTakeVoluntaryByUuid(request.uuid());
    validation.checkVoluntaryAuthentication(request.uuid(), voluntary);
    validation.checkNameDuplication(request.username(), request.fullname());
    validation.checkRootFullname(request.uuid(), request.fullname());

    String newPassword = "";
    boolean newPasswordFlag = false;
    if (request.password() != null) {
      newPassword = request.password();
      newPasswordFlag = true;
    }
    voluntary.updateVoluntary(request,  passwordEncoder.encode(newPassword), newPasswordFlag);

    return voluntary;
  }

  @Transactional
  public Voluntary updateFunctionFromVoluntary(RequestUpdateVoluntaryFunction request) {
    Voluntary manager = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    validation.checkManagerBelongsSelectedStand(request, manager);
    var voluntary = safeTakeVoluntaryByUuid(request.uuid());

    verifyUpdateFunction(request.functionUuid(), voluntary);

    return voluntary;
  }

  @Transactional
  public Voluntary updateVoluntaryRole(RequestVoluntaryRole request) {
    var voluntary = safeTakeVoluntaryByUuid(request.uuid());
    validation.checkRootCantChangeRole(voluntary);

    voluntary.updateVoluntaryRole(request);

    return voluntary;
  }

  @Transactional
  public Voluntary updatePassword(RequestPasswordVoluntary request) {
    Voluntary admin = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    validation.checkIfRoot(admin);
    var voluntary = safeTakeVoluntaryByUuid(request.uuid());

    voluntary.updatePassword(passwordEncoder.encode(NEW_PASSWORD));

    return voluntary;
  }

  @Transactional
  public void deleteVoluntary(UUID uuid) {
    Voluntary admin = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    var voluntary = safeTakeVoluntaryByUuid(uuid);
    validation.checkIfAdmin(admin);
    validation.checkRootCantBeDeleted(voluntary);

    voluntary.deleteVoluntary();
  }

  private void verifyUpdateFunction(UUID uuid, Voluntary voluntary) {
    if (uuid != null) {
      var function = functionService.takeFunctionByUuid(uuid);

      voluntary.updateVoluntaryFunction(function);
    } else {
      voluntary.updateVoluntaryFunction(null);
    }
  }
}

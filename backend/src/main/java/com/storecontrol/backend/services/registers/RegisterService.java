package com.storecontrol.backend.services.registers;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.registers.request.RequestCreateRegister;
import com.storecontrol.backend.models.registers.request.RequestUpdateRegister;
import com.storecontrol.backend.models.registers.Register;
import com.storecontrol.backend.repositories.resgisters.RegisterRepository;
import com.storecontrol.backend.services.registers.validation.RegisterValidation;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class RegisterService {

  @Autowired
  private RegisterValidation validation;

  @Autowired
  private RegisterRepository repository;

  @Transactional
  public Register createRegister(RequestCreateRegister request) {
    validation.checkNameDuplication(request.registerName());
    var register = new Register(request);
    repository.save(register);

    return register;
  }

  public Register takeRegisterByUuid(UUID uuid) {
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(EntityNotFoundException::new);
  }

  public Register safeTakeRegisterByUuid(UUID uuid) {
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(() -> new InvalidDatabaseQueryException(
            MessageResolver.getInstance().getMessage("service.exception.register.get.validation.error"),
            MessageResolver.getInstance().getMessage("service.exception.register.get.validation.message"),
            uuid.toString())
        );
  }

  public Page<Register> pageRegisters(Pageable pageable) {
    return repository.findAllValidTruePage(pageable);
  }

  public List<Register> listRegisters() {
    return repository.findAllValidTrue();
  }

  public List<Register> listAllRegisters() {
    return repository.findAll();
  }

  @Transactional
  public Register updateRegister(RequestUpdateRegister request) {
    validation.checkNameDuplication(request.registerName());
    var register = safeTakeRegisterByUuid(request.uuid());

    register.updateRegister(request);

    return register;
  }

  @Transactional
  public void deleteRegister(UUID uuid) {
    var register = safeTakeRegisterByUuid(uuid);

    register.deleteFunction();
  }
}

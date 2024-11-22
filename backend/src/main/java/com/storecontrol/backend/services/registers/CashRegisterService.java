package com.storecontrol.backend.services.registers;

import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.registers.request.RequestCreateCashRegister;
import com.storecontrol.backend.models.registers.request.RequestUpdateCashRegister;
import com.storecontrol.backend.models.registers.CashRegister;
import com.storecontrol.backend.repositories.resgisters.CashRegisterRepository;
import com.storecontrol.backend.services.registers.validation.CashRegisterValidation;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CashRegisterService {

  @Autowired
  CashRegisterValidation validation;

  @Autowired
  CashRegisterRepository repository;

  @Transactional
  public CashRegister createCashRegister(RequestCreateCashRegister request) {
    validation.checkNameDuplication(request.cashRegisterName());
    var cashRegister = new CashRegister(request);
    repository.save(cashRegister);

    return cashRegister;
  }

  public CashRegister takeCashRegisterByUuid(UUID uuid) {
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(EntityNotFoundException::new);
  }

  public CashRegister safeTakeCashRegisterByUuid(UUID uuid) {
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(() -> new InvalidDatabaseQueryException("Non-existent entity", "CashRegister", uuid.toString()));
  }

  public List<CashRegister> listCashRegisters() {
    return repository.findAllValidTrue();
  }

  @Transactional
  public CashRegister updateCashRegister(RequestUpdateCashRegister request) {
    validation.checkNameDuplication(request.cashRegisterName());
    var cashRegister = safeTakeCashRegisterByUuid(request.uuid());

    cashRegister.updateCashRegister(request);

    return cashRegister;
  }

  @Transactional
  public void deleteCashRegister(RequestUpdateCashRegister request) {
    var cashRegister = safeTakeCashRegisterByUuid(request.uuid());

    cashRegister.deleteFunction();
  }
}

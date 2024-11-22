package com.storecontrol.backend.services.registers;

import com.storecontrol.backend.models.registers.request.RequestCashRegister;
import com.storecontrol.backend.models.registers.request.RequestUpdateCashRegister;
import com.storecontrol.backend.models.registers.CashRegister;
import com.storecontrol.backend.repositories.resgisters.CashRegisterRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CashRegisterService {
  
  @Autowired
  CashRegisterRepository repository;

  @Transactional
  public CashRegister createCashRegister(RequestCashRegister request) {
    var cashRegister = new CashRegister(request);
    repository.save(cashRegister);

    return cashRegister;
  }

  public CashRegister takeCashRegisterByUuid(String uuid) {
    var standOptional = repository.findByUuidValidTrue(UUID.fromString(uuid));

    return standOptional.orElseGet(CashRegister::new);  // TODO: ERROR: stand_uuid invalid
  }

  public List<CashRegister> listCashRegisters() {
    return repository.findAllValidTrue();
  }

  @Transactional
  public CashRegister updateCashRegister(RequestUpdateCashRegister request) {
    var cashRegister = takeCashRegisterByUuid(request.uuid());

    cashRegister.updateCashRegister(request);

    return cashRegister;
  }

  @Transactional
  public void deleteCashRegister(RequestUpdateCashRegister request) {
    var cashRegister = takeCashRegisterByUuid(request.uuid());

    cashRegister.deleteFunction();
  }
}

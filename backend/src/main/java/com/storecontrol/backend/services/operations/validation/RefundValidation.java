package com.storecontrol.backend.services.operations.validation;

import com.storecontrol.backend.infra.exceptions.InvalidOperationException;
import com.storecontrol.backend.models.registers.CashRegister;
import com.storecontrol.backend.models.volunteers.Voluntary;
import org.springframework.stereotype.Component;

@Component
public class RefundValidation {

  public void checkVoluntaryFunctionMatch(Voluntary voluntary) {
    if (voluntary.getVoluntaryRole().isNotAdmin()) {
      if ((voluntary.getFunction() == null)) {
        throw new InvalidOperationException("Create Refund", "This voluntary has no role");
      } else {
        if (!(voluntary.getFunction() instanceof CashRegister)) {
          throw new InvalidOperationException("Create Refund", "This voluntary can't do this operation");
        }
      }
    }
  }
}

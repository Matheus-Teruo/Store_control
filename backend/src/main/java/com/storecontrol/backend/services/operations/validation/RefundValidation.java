package com.storecontrol.backend.services.operations.validation;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidOperationException;
import com.storecontrol.backend.models.registers.CashRegister;
import com.storecontrol.backend.models.volunteers.Voluntary;
import org.springframework.stereotype.Component;

@Component
public class RefundValidation {

  public void checkVoluntaryFunctionMatch(Voluntary voluntary) {
    if (voluntary.getVoluntaryRole().isNotAdmin()) {
      if ((voluntary.getFunction() == null)) {
        throw new InvalidOperationException(
            MessageResolver.getInstance().getMessage("validation.refund.checkVoluntary.functionNull.error"),
            MessageResolver.getInstance().getMessage("validation.refund.checkVoluntary.functionNull.message")
        );
      } else {
        if (!(voluntary.getFunction() instanceof CashRegister)) {
          throw new InvalidOperationException(
              MessageResolver.getInstance().getMessage("validation.refund.checkVoluntary.functionDifferent.error"),
              MessageResolver.getInstance().getMessage("validation.refund.checkVoluntary.functionDifferent.message")
          );
        }
      }
    }
  }
}

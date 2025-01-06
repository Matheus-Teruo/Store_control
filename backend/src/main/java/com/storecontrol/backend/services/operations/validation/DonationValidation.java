package com.storecontrol.backend.services.operations.validation;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidOperationException;
import com.storecontrol.backend.models.registers.CashRegister;
import com.storecontrol.backend.models.volunteers.Voluntary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DonationValidation {

  public void checkVoluntaryFunctionMatch(Voluntary voluntary) {
    if (voluntary.getVoluntaryRole().isNotAdmin()) {
      if ((voluntary.getFunction() == null)) {
        throw new InvalidOperationException(
            MessageResolver.getInstance().getMessage("validation.donation.checkVoluntary.functionNull.error"),
            MessageResolver.getInstance().getMessage("validation.donation.checkVoluntary.functionNull.message")
        );
      } else {
        if (!(voluntary.getFunction() instanceof CashRegister)) {
          throw new InvalidOperationException(
              MessageResolver.getInstance().getMessage("validation.donation.checkVoluntary.functionDifferent.error"),
              MessageResolver.getInstance().getMessage("validation.donation.checkVoluntary.functionDifferent.message")
          );
        }
      }
    }
  }
}

package com.storecontrol.backend.services.operations.validation;

import com.storecontrol.backend.infra.exceptions.InvalidOperationException;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.volunteers.Function;
import com.storecontrol.backend.models.volunteers.Voluntary;
import org.springframework.stereotype.Component;

@Component
public class RechargeValidation {

  public void checkVoluntaryFunctionMatch(Function function, Voluntary voluntary) {
    if (voluntary.getVoluntaryRole().isNotAdmin()) {
      if ((voluntary.getFunction() == null)) {
        throw new InvalidOperationException("Create Recharge", "This voluntary has no role");
      } else {
        if (!(voluntary.getFunction().getUuid() == function.getUuid())) {
          throw new InvalidOperationException("Create Recharge", "This voluntary can't do this operation");
        }
      }
    }
  }

  public void checkDebitGreaterThanUndoDonation(Recharge recharge) {
    var rechargeValue = recharge.getRechargeValue();
    var currentDebit = recharge.getCustomer().getOrderCard().getDebit();

    if (rechargeValue.compareTo(currentDebit) > 0 ) {
      throw new InvalidOperationException("Delete Recharge", "Customer does not have enough debit to undo the recharge");
    }
  }
}

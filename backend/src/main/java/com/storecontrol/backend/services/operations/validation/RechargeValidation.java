package com.storecontrol.backend.services.operations.validation;

import com.storecontrol.backend.infra.exceptions.InvalidOperationException;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.volunteers.Function;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.repositories.operations.RechargeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class RechargeValidation {

  @Autowired
  RechargeRepository repository;

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

  public void checkRechargeBelongsToVoluntary(Recharge recharge, UUID userUuid) {
    if (recharge.getVoluntary().getVoluntaryRole().isNotAdmin() && recharge.getVoluntary().getUuid() != userUuid) {
      throw new InvalidOperationException("Delete Recharge", "This recharge don't belongs to this voluntary");
    }
  }

  public void checkIfLastRechargeOfVoluntary(Recharge recharge, Voluntary voluntary) {
    if (voluntary.getVoluntaryRole().isNotAdmin()) {
      Optional<Recharge> optionalRecharge = repository.findLastFromVoluntary(voluntary.getUuid());

      if (optionalRecharge.isPresent()) {
        if (optionalRecharge.get().getUuid() != recharge.getUuid()) {
          throw new InvalidOperationException("Delete Recharge", "This recharge is not the last form this voluntary");
        }
      } else {
        throw new InvalidOperationException("Delete Recharge", "This voluntary don't have any recharge done");
      }
    }
  }
}

package com.storecontrol.backend.services.operations.validation;

import com.storecontrol.backend.config.language.MessageResolver;
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
        throw new InvalidOperationException(
            MessageResolver.getInstance().getMessage("validation.recharge.checkVoluntary.functionNull.error"),
            MessageResolver.getInstance().getMessage("validation.recharge.checkVoluntary.functionNull.message")
        );
      } else {
        if (!(voluntary.getFunction().getUuid().equals(function.getUuid()))) {
          throw new InvalidOperationException(
              MessageResolver.getInstance().getMessage("validation.recharge.checkVoluntary.functionDifferent.error"),
              MessageResolver.getInstance().getMessage("validation.recharge.checkVoluntary.functionDifferent.message")
          );
        }
      }
    }
  }

  public void checkDebitRemainderPositive(Recharge recharge) {
    var rechargeValue = recharge.getRechargeValue();
    var currentDebit = recharge.getCustomer().getOrderCard().getDebit();

    if (rechargeValue.compareTo(currentDebit) > 0 ) {
      throw new InvalidOperationException(
          MessageResolver.getInstance().getMessage("validation.recharge.checkDebit.notEnoughDebit.error"),
          MessageResolver.getInstance().getMessage("validation.recharge.checkDebit.notEnoughDebit.message")
      );
    }
  }

  public void checkRechargeBelongsToVoluntary(Recharge recharge, UUID userUuid) {
    if (recharge.getVoluntary().getVoluntaryRole().isNotAdmin() && !recharge.getVoluntary().getUuid().equals(userUuid)) {
      throw new InvalidOperationException(
          MessageResolver.getInstance().getMessage("validation.recharge.checkVoluntary.notOwner.error"),
          MessageResolver.getInstance().getMessage("validation.recharge.checkVoluntary.notOwner.message")
      );
    }
  }

  public void checkIfLastRechargeOfVoluntary(Recharge recharge, Voluntary voluntary) {
    if (voluntary.getVoluntaryRole().isNotAdmin()) {
      Optional<Recharge> optionalRecharge = repository.findLastFromVoluntary(voluntary.getUuid());

      if (optionalRecharge.isPresent()) {
        if (!optionalRecharge.get().getUuid().equals(recharge.getUuid())) {
          throw new InvalidOperationException(
              MessageResolver.getInstance().getMessage("validation.recharge.checkLastPurchase.notLast.error"),
              MessageResolver.getInstance().getMessage("validation.recharge.checkLastPurchase.notLast.message")
          );
        }
      } else {
        throw new InvalidOperationException(
            MessageResolver.getInstance().getMessage("validation.recharge.checkLastPurchase.notPresent.error"),
            MessageResolver.getInstance().getMessage("validation.recharge.checkLastPurchase.notPresent.message")
        );
      }
    }
  }
}

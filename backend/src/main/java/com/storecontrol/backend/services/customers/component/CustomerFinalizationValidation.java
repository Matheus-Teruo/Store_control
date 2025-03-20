package com.storecontrol.backend.services.customers.component;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidCustomerException;
import com.storecontrol.backend.infra.exceptions.InvalidOperationException;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.enumerate.PaymentType;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.registers.CashRegister;
import com.storecontrol.backend.models.volunteers.Function;
import com.storecontrol.backend.models.volunteers.Voluntary;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class CustomerFinalizationValidation {

  public void checkVoluntaryFunctionMatch(Function function, Voluntary voluntary) {
    if (voluntary.getVoluntaryRole().isNotAdmin()) {
      if ((voluntary.getFunction() == null)) {
        throw new InvalidOperationException(
            MessageResolver.getInstance().getMessage("validation.customerFinalization.checkVoluntary.functionNull.error"),
            MessageResolver.getInstance().getMessage("validation.customerFinalization.checkVoluntary.functionNull.message")
        );
      } else {
        if (!(voluntary.getFunction().getUuid().equals(function.getUuid()))) {
          throw new InvalidOperationException(
              MessageResolver.getInstance().getMessage("validation.customerFinalization.checkVoluntary.functionDifferent.error"),
              MessageResolver.getInstance().getMessage("validation.customerFinalization.checkVoluntary.functionDifferent.message")
          );
        }
      }
    }
  }

  public void checkVoluntaryFunctionType(Voluntary voluntary) {
    if (voluntary.getVoluntaryRole().isNotAdmin()) {
      if ((voluntary.getFunction() == null)) {
        throw new InvalidOperationException(
            MessageResolver.getInstance().getMessage("validation.customerFinalization.checkVoluntary.functionNull.error"),
            MessageResolver.getInstance().getMessage("validation.customerFinalization.checkVoluntary.functionNull.message")
        );
      } else {
        if (!(voluntary.getFunction() instanceof CashRegister)) {
          throw new InvalidOperationException(
              MessageResolver.getInstance().getMessage("validation.customerFinalization.checkVoluntary.functionDifferent.error"),
              MessageResolver.getInstance().getMessage("validation.customerFinalization.checkVoluntary.functionDifferent.message")
          );
        }
      }
    }
  }

  public void checkDonationValueValid(BigDecimal donationValue, Customer customer) {
    var currentDebit = customer.getOrderCard().getDebit();

    if (donationValue.compareTo(currentDebit) > 0) {
      throw new InvalidCustomerException(
          MessageResolver.getInstance().getMessage("validation.customerFinalization.checkDonation.donationInvalid.error"),
          MessageResolver.getInstance().getMessage("validation.customerFinalization.checkDonation.donationInvalid.message")
      );
    }
  }

  public void checkRefundValueValid(BigDecimal refundValue, Customer customer) {
    var remainingDebit = customer.getOrderCard().getDebit();
    var viableValueForRefund = customer.getRecharges().stream()
        .filter(recharge -> recharge.getPaymentTypeEnum() == PaymentType.CASH && recharge.isValid())
        .map(Recharge::getRechargeValue)
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    if (remainingDebit.compareTo(viableValueForRefund) >= 0 ) {
      if (viableValueForRefund.compareTo(refundValue) < 0) {
        throw new InvalidCustomerException(
            MessageResolver.getInstance().getMessage("validation.customerFinalization.checkRefund.refundInvalid.error"),
            MessageResolver.getInstance().getMessage("validation.customerFinalization.checkRefund.refundInvalid.message")
        );
      }

    } else {
      if (remainingDebit.compareTo(refundValue) < 0) {
        throw new InvalidCustomerException(
            MessageResolver.getInstance().getMessage("validation.customerFinalization.checkRefund.refundInsufficientDebit.error"),
            MessageResolver.getInstance().getMessage("validation.customerFinalization.checkRefund.refundInsufficientDebit.message")
        );
      }
    }
  }
}

package com.storecontrol.backend.services.customers.component;

import com.storecontrol.backend.infra.exceptions.InvalidCustomerException;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.enumerate.PaymentType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class CustomerFinalizationValidation {

  public void checkDonationValueValid(BigDecimal donationValue, Customer customer) {
    var currentDebit = customer.getOrderCard().getDebit();

    if (donationValue.compareTo(currentDebit) > 0) {
      throw new InvalidCustomerException("Donation", "donation value is greater than the current debit amount");
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
        throw new InvalidCustomerException("Refund", "refund value is greater than the amount available to refund");
      }

    } else {

      if (remainingDebit.compareTo(refundValue) < 0) {
        throw new InvalidCustomerException("Refund", "refund value is greater than the remaining debit");
      }

    }
  }
}

package com.storecontrol.backend.services.validation;

import com.storecontrol.backend.models.Customer;
import com.storecontrol.backend.models.Recharge;
import com.storecontrol.backend.models.enumerate.PaymentType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class FinalizationOfCustomerValidate {

  public void checkDonationValueValid(BigDecimal donationValue, Customer customer) {
    var currentDebit = customer.getOrderCard().getDebit();

    if (donationValue.compareTo(currentDebit) > 0) {
      // TODO: error: insufficient balance or remaind credit to nothing
    }
  }

  public void checkRefundValueValid(BigDecimal refundValue, Customer customer) {
    var remainingDebit = customer.getOrderCard().getDebit();
    // NOTE: this variable require to take a list of recharge from customer
    var viableValueForRefund = customer.getRecharges().stream()
        .filter(recharge -> recharge.getPaymentTypeEnum() == PaymentType.CASH && recharge.getValid())
        .map(Recharge::getRechargeValue)
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    if (remainingDebit.compareTo(viableValueForRefund) >= 0 ) {

      if (viableValueForRefund.compareTo(refundValue) < 0) {
        // TODO: error refund value bigger than recharge with cash
      }

    } else {

      if (remainingDebit.compareTo(refundValue) < 0) {
        // TODO: error refund value bigger than recharge with
      }

    }
  }
}

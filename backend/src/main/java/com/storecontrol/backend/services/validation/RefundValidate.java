package com.storecontrol.backend.services.validation;

import com.storecontrol.backend.models.Customer;
import com.storecontrol.backend.models.Recharge;
import com.storecontrol.backend.models.enumerate.PaymentType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class RefundValidate {

  public void checkRefundValueValid(BigDecimal refundValue, BigDecimal remainingDebit, Customer customer) {
    BigDecimal viableValueForRefund = customer.getRecharges().stream()
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

package com.storecontrol.backend.models.operations.response;

import com.storecontrol.backend.models.enumerate.PaymentType;
import com.storecontrol.backend.models.operations.Recharge;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseSummaryRecharge(
    UUID uuid,
    BigDecimal rechargeValue,
    String rechargeTimeStamp,
    PaymentType paymentTypeEnum,
    UUID summaryVoluntary
) {

  public ResponseSummaryRecharge(Recharge recharge) {
    this(recharge.getUuid(),
        recharge.getRechargeValue(),
        recharge.getRechargeTimeStamp().toString(),
        recharge.getPaymentTypeEnum(),
        recharge.getVoluntaryUuid()
    );
  }
}

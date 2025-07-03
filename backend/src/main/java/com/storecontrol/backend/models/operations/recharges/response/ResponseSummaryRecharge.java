package com.storecontrol.backend.models.operations.recharges.response;

import com.storecontrol.backend.models.enumerate.PaymentType;
import com.storecontrol.backend.models.operations.recharges.Recharge;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseSummaryRecharge(
    UUID uuid,
    BigDecimal rechargeValue,
    PaymentType paymentTypeEnum,
    String rechargeTimestamp,
    UUID registerUuid
) {

  public ResponseSummaryRecharge(Recharge recharge) {
    this(recharge.getUuid(),
        recharge.getRechargeValue(),
        recharge.getPaymentTypeEnum(),
        recharge.getRechargeTimestamp().toString(),
        recharge.getRegisterUuid()
    );
  }
}

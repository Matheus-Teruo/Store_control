package com.storecontrol.backend.models.operations.response;

import com.storecontrol.backend.models.enumerate.PaymentType;
import com.storecontrol.backend.models.operations.Recharge;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseRechargeOrder(
    UUID uuid,
    BigDecimal rechargeValue,
    PaymentType paymentTypeEnum,
    String rechargeTimeStamp
) {

  public ResponseRechargeOrder(Recharge recharge) {
    this(recharge.getUuid(),
        recharge.getRechargeValue(),
        recharge.getPaymentTypeEnum(),
        recharge.getRechargeTimeStamp().toString()
    );
  }
}

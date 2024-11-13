package com.storecontrol.backend.controllers.response.recharge;

import com.storecontrol.backend.controllers.response.voluntary.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.Recharge;
import com.storecontrol.backend.models.enumerate.PaymentType;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseSummaryRecharge(
    UUID uuid,
    BigDecimal rechargeValue,
    String rechargeTimeStamp,
    Enum<PaymentType> paymentTypeEnum,
    ResponseSummaryVoluntary summaryVoluntary
) {

  public ResponseSummaryRecharge(Recharge recharge) {
    this(recharge.getUuid(),
        recharge.getRechargeValue(),
        recharge.getRechargeTimeStamp().toLocalTime().toString(),
        recharge.getPaymentTypeEnum(),
        new ResponseSummaryVoluntary(recharge.getVoluntary())
    );
  }
}

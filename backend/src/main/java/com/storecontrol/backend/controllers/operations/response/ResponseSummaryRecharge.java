package com.storecontrol.backend.controllers.operations.response;

import com.storecontrol.backend.controllers.volunteers.response.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.operations.Recharge;
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
        recharge.getRechargeTimeStamp().toString(),
        recharge.getPaymentTypeEnum(),
        new ResponseSummaryVoluntary(recharge.getVoluntary())
    );
  }
}

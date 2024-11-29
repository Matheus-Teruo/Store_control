package com.storecontrol.backend.models.operations.response;

import com.storecontrol.backend.models.volunteers.response.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.enumerate.PaymentType;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseSummaryRecharge(
    UUID uuid,
    BigDecimal rechargeValue,
    String rechargeTimeStamp,
    PaymentType paymentTypeEnum,
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

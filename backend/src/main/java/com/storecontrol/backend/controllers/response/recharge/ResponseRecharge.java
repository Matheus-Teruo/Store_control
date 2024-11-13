package com.storecontrol.backend.controllers.response.recharge;

import com.storecontrol.backend.controllers.response.customer.ResponseSummaryCustomer;
import com.storecontrol.backend.controllers.response.voluntary.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.Recharge;
import com.storecontrol.backend.models.enumerate.PaymentType;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseRecharge(
    UUID uuid,
    BigDecimal rechargeValue,
    String rechargeTimeStamp,
    Enum<PaymentType> paymentTypeEnum,
    ResponseSummaryCustomer summaryCustomer,
    ResponseSummaryVoluntary summaryVoluntary
) {

  public ResponseRecharge(Recharge recharge) {
    this(recharge.getUuid(),
        recharge.getRechargeValue(),
        recharge.getRechargeTimeStamp().toLocalTime().toString(),
        recharge.getPaymentTypeEnum(),
        new ResponseSummaryCustomer(recharge.getCustomer()),
        new ResponseSummaryVoluntary(recharge.getVoluntary())
    );
  }
}

package com.storecontrol.backend.controllers.operations.response;

import com.storecontrol.backend.controllers.customers.response.ResponseSummaryCustomer;
import com.storecontrol.backend.controllers.volunteers.response.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.operations.Recharge;
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
        recharge.getRechargeTimeStamp().toString(),
        recharge.getPaymentTypeEnum(),
        new ResponseSummaryCustomer(recharge.getCustomer()),
        new ResponseSummaryVoluntary(recharge.getVoluntary())
    );
  }
}

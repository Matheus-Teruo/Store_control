package com.storecontrol.backend.models.operations.response;

import com.storecontrol.backend.models.customers.response.ResponseSummaryCustomer;
import com.storecontrol.backend.models.volunteers.response.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.enumerate.PaymentType;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseRecharge(
    UUID uuid,
    BigDecimal rechargeValue,
    PaymentType paymentTypeEnum,
    String rechargeTimeStamp,
    ResponseSummaryCustomer summaryCustomer,
    ResponseSummaryVoluntary summaryVoluntary
) {

  public ResponseRecharge(Recharge recharge) {
    this(recharge.getUuid(),
        recharge.getRechargeValue(),
        recharge.getPaymentTypeEnum(),
        recharge.getRechargeTimeStamp().toString(),
        new ResponseSummaryCustomer(recharge.getCustomer()),
        new ResponseSummaryVoluntary(recharge.getVoluntary())
    );
  }
}

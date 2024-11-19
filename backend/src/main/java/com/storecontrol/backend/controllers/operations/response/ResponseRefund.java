package com.storecontrol.backend.controllers.operations.response;

import com.storecontrol.backend.controllers.customers.response.ResponseSummaryCustomer;
import com.storecontrol.backend.controllers.volunteers.response.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.operations.Refund;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseRefund(
    UUID uuid,
    BigDecimal refundValue,
    String refundTimeStamp,
    ResponseSummaryCustomer summaryCustomer,
    ResponseSummaryVoluntary summaryVoluntary
) {

  public ResponseRefund(Refund refund) {
    this(refund.getUuid(),
        refund.getRefundValue(),
        refund.getRefundTimeStamp().toString(),
        new ResponseSummaryCustomer(refund.getCustomer()),
        new ResponseSummaryVoluntary(refund.getVoluntary()));
  }
}

package com.storecontrol.backend.controllers.response.refund;

import com.storecontrol.backend.controllers.response.customer.ResponseSummaryCustomer;
import com.storecontrol.backend.controllers.response.voluntary.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.Refund;

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

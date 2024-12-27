package com.storecontrol.backend.models.operations.response;

import com.storecontrol.backend.models.operations.Refund;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseSummaryRefund(
    UUID uuid,
    BigDecimal refundValue,
    String refundTimeStamp,
    UUID summaryVoluntary
) {

  public ResponseSummaryRefund(Refund refund) {
    this(refund.getUuid(),
        refund.getRefundValue(),
        refund.getRefundTimeStamp().toString(),
        refund.getVoluntaryUuid()
    );
  }
}

package com.storecontrol.backend.models.operations.finalization.response;

import com.storecontrol.backend.models.operations.finalization.Refund;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseSummaryRefund(
    UUID uuid,
    BigDecimal refundValue,
    String refundTimestamp,
    UUID voluntaryUuid
) {

  public ResponseSummaryRefund(Refund refund) {
    this(refund.getUuid(),
        refund.getRefundValue(),
        refund.getRefundTimestamp().toString(),
        refund.getVoluntaryUuid()
    );
  }
}

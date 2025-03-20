package com.storecontrol.backend.models.operations.response;

import com.storecontrol.backend.models.operations.Refund;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseRefundOrder(
    UUID uuid,
    BigDecimal refundValue,
    String refundTimeStamp
) {

  public ResponseRefundOrder(Refund refund) {
    this(refund.getUuid(),
        refund.getRefundValue(),
        refund.getRefundTimeStamp().toString()
    );
  }
}

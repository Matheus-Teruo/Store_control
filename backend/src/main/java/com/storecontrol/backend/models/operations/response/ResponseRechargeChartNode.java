package com.storecontrol.backend.models.operations.response;

import com.storecontrol.backend.models.enumerate.PaymentType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ResponseRechargeChartNode(
    LocalDateTime time,
    PaymentType paymentType,
    BigDecimal total
) {
}

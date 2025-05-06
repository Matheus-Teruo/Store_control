package com.storecontrol.backend.models.charts.response;

import com.storecontrol.backend.models.enumerate.PaymentType;

import java.math.BigDecimal;

public record ResponsePaymentTypeChart(
    PaymentType paymentType,
    BigDecimal total
) {
}

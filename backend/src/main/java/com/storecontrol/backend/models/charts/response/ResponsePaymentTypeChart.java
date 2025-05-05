package com.storecontrol.backend.models.charts.response;

import java.math.BigDecimal;

public record ResponsePaymentTypeChart(
    BigDecimal cashTotal,
    BigDecimal creditTotal,
    BigDecimal debitTotal
) {
}

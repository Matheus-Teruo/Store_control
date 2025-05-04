package com.storecontrol.backend.models.registers.response;

import java.math.BigDecimal;

public record ResponsePaymentTypeChart(
    BigDecimal cashTotal,
    BigDecimal creditTotal,
    BigDecimal debitTotal
) {
}

package com.storecontrol.backend.models.statistics.registers.response;

import com.storecontrol.backend.models.enumerate.PaymentType;

import java.math.BigDecimal;

public record ResponsePaymentTypeTotal(
    PaymentType paymentType,
    BigDecimal total
) {
}

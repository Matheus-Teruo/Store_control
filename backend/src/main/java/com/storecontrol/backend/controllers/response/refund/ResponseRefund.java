package com.storecontrol.backend.controllers.response.refund;

import com.storecontrol.backend.controllers.response.customer.ResponseSummaryCustomer;
import com.storecontrol.backend.controllers.response.voluntary.ResponseSummaryVoluntary;

import java.math.BigDecimal;

public record ResponseRefund(
    BigDecimal refundValue,
    ResponseSummaryCustomer summaryCustomer,
    ResponseSummaryVoluntary summaryVoluntary
) {
}

package com.storecontrol.backend.controllers.response.sale;

import com.storecontrol.backend.controllers.response.customer.ResponseSummaryCustomer;
import com.storecontrol.backend.controllers.response.voluntary.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.Sale;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record ResponseSummarySale(
    UUID uuid,
    Boolean onOrder,
    LocalDateTime saleTimeStamp,
    Integer totalGoods,
    BigDecimal totalCost,
    ResponseSummaryCustomer summaryCustomer,
    ResponseSummaryVoluntary summaryVoluntary
) {

  public ResponseSummarySale(Sale sale) {
    this(
        sale.getUuid(),
        sale.getOnOrder(),
        sale.getSaleTimeStamp(),
        sale.getGoods().size(),
        sale.getGoods().stream()
            .map(good -> BigDecimal.valueOf(good.getQuantity())
                .multiply(good.getUnitPrice()))
            .reduce(BigDecimal.ZERO, BigDecimal::add),
        new ResponseSummaryCustomer(sale.getCustomer()),
        new ResponseSummaryVoluntary(sale.getVoluntary())
    );
  }
}

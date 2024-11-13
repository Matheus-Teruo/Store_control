package com.storecontrol.backend.controllers.response.sale;

import com.storecontrol.backend.controllers.response.customer.ResponseSummaryCustomer;
import com.storecontrol.backend.controllers.response.good.ResponseGood;
import com.storecontrol.backend.controllers.response.voluntary.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.Sale;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ResponseSale(
    UUID uuid,
    Boolean onOrder,
    LocalDateTime saleTimeStamp,
    List<ResponseGood> goods,
    ResponseSummaryCustomer summaryCustomer,
    ResponseSummaryVoluntary summaryVoluntary
) {

  public ResponseSale(Sale sale) {
    this(
        sale.getUuid(),
        sale.getOnOrder(),
        sale.getSaleTimeStamp(),
        sale.getGoods().stream().map(ResponseGood::new).toList(),
        new ResponseSummaryCustomer(sale.getCustomer()),
        new ResponseSummaryVoluntary(sale.getVoluntary())
    );
  }
}

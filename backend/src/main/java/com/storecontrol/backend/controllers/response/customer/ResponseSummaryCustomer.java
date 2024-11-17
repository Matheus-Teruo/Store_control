package com.storecontrol.backend.controllers.response.customer;

import com.storecontrol.backend.controllers.response.orderCard.ResponseSummaryOrderCard;
import com.storecontrol.backend.models.Customer;

import java.util.UUID;

public record ResponseSummaryCustomer(
    UUID uuid,
    ResponseSummaryOrderCard summaryOrderCard,
    String customerStart,
    String customerEnd
) {

  public ResponseSummaryCustomer(Customer customer) {
    this(customer.getUuid(),
        customer.getInUse() ? new ResponseSummaryOrderCard(customer.getOrderCard()) : null,
        customer.getCustomerStart().toString(),
        customer.getCustomerEnd() != null ? customer.getCustomerEnd().toString() : null
    );
  }
}

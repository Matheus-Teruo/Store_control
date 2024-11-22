package com.storecontrol.backend.models.customers.response;

import com.storecontrol.backend.models.customers.Customer;

import java.util.UUID;

public record ResponseSummaryCustomer(
    UUID uuid,
    ResponseSummaryOrderCard summaryOrderCard,
    String customerStart,
    String customerEnd
) {

  public ResponseSummaryCustomer(Customer customer) {
    this(customer.getUuid(),
        customer.isInUse() ? new ResponseSummaryOrderCard(customer.getOrderCard()) : null,
        customer.getCustomerStart().toString(),
        customer.getCustomerEnd() != null ? customer.getCustomerEnd().toString() : null
    );
  }
}

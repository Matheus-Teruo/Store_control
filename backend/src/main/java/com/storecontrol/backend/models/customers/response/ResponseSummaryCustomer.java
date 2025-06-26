package com.storecontrol.backend.models.customers.response;

import com.storecontrol.backend.models.customers.Customer;

import java.util.UUID;

public record ResponseSummaryCustomer(
    UUID uuid,
    ResponseSummaryCard summaryCard,
    String customerStart,
    String customerEnd
) {

  public ResponseSummaryCustomer(Customer customer) {
    this(customer.getUuid(),
        customer.isInUse() ? new ResponseSummaryCard(customer.getCard()) : null,
        customer.getCustomerStart().toString(),
        customer.getCustomerEnd() != null ? customer.getCustomerEnd().toString() : null
    );
  }
}

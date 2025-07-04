package com.storecontrol.backend.models.customers.response;

import com.storecontrol.backend.models.customers.Customer;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseSummaryCustomer(
    UUID uuid,
    BigDecimal cardDebit,
    String customerStart,
    String customerEnd
) {

  public ResponseSummaryCustomer(Customer customer) {
    this(customer.getUuid(),
        customer.isInUse() ? customer.getCard().getDebit() : BigDecimal.ZERO,
        customer.getCustomerStart().toString(),
        customer.getCustomerEnd() != null ? customer.getCustomerEnd().toString() : null
    );
  }
}

package com.storecontrol.backend.controllers.response.customer;

import com.storecontrol.backend.models.Customer;
import com.storecontrol.backend.models.OrderCard;
import com.storecontrol.backend.models.Voluntary;

public record ResponseSummaryCustomer(
    String uuid,
    OrderCard orderCard,
    String customerStart,
    String customerEnd,
    Voluntary voluntary
) {

  public ResponseSummaryCustomer(Customer customer) {
    this(customer.getUuid().toString(),
        customer.getOrderCard(),
        customer.getCustomerStart().toString(),
        customer.getCustomerEnd().toString(),
        customer.getVoluntary());
  }
}

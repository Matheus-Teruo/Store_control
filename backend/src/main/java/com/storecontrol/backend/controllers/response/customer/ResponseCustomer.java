package com.storecontrol.backend.controllers.response.customer;

import com.storecontrol.backend.models.*;

import java.util.List;

public record ResponseCustomer(
    String uuid,
    OrderCard orderCard,
    String customerStart,
    String customerEnd,
    List<Recharge> recharges,
    List<Sale>sales,
    Donation donation,
    Voluntary voluntary
) {

  public ResponseCustomer(Customer customer) {
    this(customer.getUuid().toString(),
        customer.getOrderCard(),
        customer.getCustomerStart().toString(),
        customer.getCustomerEnd().toString(),
        customer.getRecharges(),
        customer.getSales(),
        customer.getDonation(),
        customer.getVoluntary());
  }
}

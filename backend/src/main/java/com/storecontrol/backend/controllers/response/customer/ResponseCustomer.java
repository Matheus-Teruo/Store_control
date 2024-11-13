package com.storecontrol.backend.controllers.response.customer;

import com.storecontrol.backend.controllers.response.donation.ResponseSummaryDonation;
import com.storecontrol.backend.controllers.response.orderCard.ResponseOrderCard;
import com.storecontrol.backend.controllers.response.recharge.ResponseSummaryRecharge;
import com.storecontrol.backend.controllers.response.sale.ResponseSummarySale;
import com.storecontrol.backend.models.Customer;

import java.util.List;
import java.util.UUID;

public record ResponseCustomer(
    UUID uuid,
    ResponseOrderCard orderCard,
    String customerStart,
    String customerEnd,
    List<ResponseSummaryRecharge> recharges,
    List<ResponseSummarySale> sales,
    ResponseSummaryDonation donation
) {

  public ResponseCustomer(Customer customer) {
    this(customer.getUuid(),
        new ResponseOrderCard(customer.getOrderCard()),
        customer.getCustomerStart().toString(),
        customer.getCustomerEnd() != null ? customer.getCustomerEnd().toString() : null,
        customer.getRecharges().stream().map(ResponseSummaryRecharge::new).toList(),
        customer.getSales().stream().map(ResponseSummarySale::new).toList(),
        customer.getDonation() != null ? new ResponseSummaryDonation(customer.getDonation()) : null
    );
  }
}

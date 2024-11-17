package com.storecontrol.backend.controllers.response.customer;

import com.storecontrol.backend.controllers.response.donation.ResponseSummaryDonation;
import com.storecontrol.backend.controllers.response.orderCard.ResponseOrderCard;
import com.storecontrol.backend.controllers.response.purchase.ResponseSummaryPurchase;
import com.storecontrol.backend.controllers.response.recharge.ResponseSummaryRecharge;
import com.storecontrol.backend.controllers.response.refund.ResponseSummaryRefund;
import com.storecontrol.backend.models.Customer;

import java.util.List;
import java.util.UUID;

public record ResponseCustomer(
    UUID uuid,
    ResponseOrderCard orderCard,
    String customerStart,
    String customerEnd,
    List<ResponseSummaryRecharge> summaryRecharges,
    List<ResponseSummaryPurchase> summaryPurchases,
    ResponseSummaryDonation summaryDonation,
    ResponseSummaryRefund summaryRefund
) {

  public ResponseCustomer(Customer customer) {
    this(customer.getUuid(),
        new ResponseOrderCard(customer.getOrderCard()),
        customer.getCustomerStart().toString(),
        customer.getCustomerEnd() != null ? customer.getCustomerEnd().toString() : null,
        customer.getRecharges().stream().map(ResponseSummaryRecharge::new).toList(),
        customer.getPurchases().stream().map(ResponseSummaryPurchase::new).toList(),
        !customer.getDonations().isEmpty() ? new ResponseSummaryDonation(customer.getDonations().getFirst()) : null,
        !customer.getRefunds().isEmpty() ? new ResponseSummaryRefund(customer.getRefunds().getFirst()) : null
    );
  }
}

package com.storecontrol.backend.models.customers.response;

import com.storecontrol.backend.models.operations.response.ResponseSummaryDonation;
import com.storecontrol.backend.models.operations.purchases.response.ResponseSummaryPurchase;
import com.storecontrol.backend.models.operations.response.ResponseSummaryRecharge;
import com.storecontrol.backend.models.operations.response.ResponseSummaryRefund;
import com.storecontrol.backend.models.customers.Customer;

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

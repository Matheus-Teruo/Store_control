package com.storecontrol.backend.models.customers.response;

import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.operations.purchases.response.ResponsePurchaseOrder;
import com.storecontrol.backend.models.operations.response.ResponseDonationOrder;
import com.storecontrol.backend.models.operations.response.ResponseRechargeOrder;
import com.storecontrol.backend.models.operations.response.ResponseRefundOrder;

import java.util.List;
import java.util.UUID;

public record ResponseCustomerOrder(
  UUID uuid,
  ResponseOrderCard orderCard,
  List<ResponseRechargeOrder> summaryRecharges,
  List<ResponsePurchaseOrder> summaryPurchases,
  ResponseDonationOrder summaryDonation,
  ResponseRefundOrder summaryRefund
) {

  public ResponseCustomerOrder(Customer customer) {
      this(customer.getUuid(),
          new ResponseOrderCard(customer.getOrderCard()),
          customer.getRecharges().stream().map(ResponseRechargeOrder::new).toList(),
          customer.getPurchases().stream().map(ResponsePurchaseOrder::new).toList(),
          !customer.getDonations().isEmpty() ? new ResponseDonationOrder(customer.getDonations().getFirst()) : null,
          !customer.getRefunds().isEmpty() ? new ResponseRefundOrder(customer.getRefunds().getFirst()) : null
      );
    }
  }
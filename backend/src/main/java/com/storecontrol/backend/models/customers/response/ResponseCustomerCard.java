package com.storecontrol.backend.models.customers.response;

import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.operations.purchases.response.ResponsePurchaseCard;
import com.storecontrol.backend.models.operations.finalization.response.ResponseDonationCard;
import com.storecontrol.backend.models.operations.recharges.response.ResponseRechargeCard;
import com.storecontrol.backend.models.operations.finalization.response.ResponseRefundCard;

import java.util.List;
import java.util.UUID;

public record ResponseCustomerCard(
  UUID uuid,
  ResponseCard card,
  List<ResponseRechargeCard> recharges,
  List<ResponsePurchaseCard> purchases,
  ResponseDonationCard donation,
  ResponseRefundCard refund
) {

  public ResponseCustomerCard(Customer customer) {
      this(customer.getUuid(),
          new ResponseCard(customer.getCard()),
          customer.getRecharges().stream().map(ResponseRechargeCard::new).toList(),
          customer.getPurchases().stream().map(ResponsePurchaseCard::new).toList(),
          !customer.getDonations().isEmpty() ? new ResponseDonationCard(customer.getDonations().getFirst()) : null,
          !customer.getRefunds().isEmpty() ? new ResponseRefundCard(customer.getRefunds().getFirst()) : null
      );
    }
  }
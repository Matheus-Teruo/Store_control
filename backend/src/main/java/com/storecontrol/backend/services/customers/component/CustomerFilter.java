package com.storecontrol.backend.services.customers.component;

import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.operations.Donation;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.operations.Refund;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CustomerFilter {
  public void filterInactiveRelations(Customer customer) {
    customer.setRecharges(filterValidRecharges(customer.getRecharges()));
    customer.setPurchases(filterValidPurchases(customer.getPurchases()));
    customer.setDonations(filterValidDonation(customer.getDonations()));
    customer.setRefunds(filterValidRefund(customer.getRefunds()));
  }

  private List<Recharge> filterValidRecharges(List<Recharge> recharges) {
    return recharges.stream()
        .filter(Recharge::isValid).toList();
  }

  private List<Purchase> filterValidPurchases(List<Purchase> purchases) {
    return purchases.stream()
        .filter(Purchase::isValid).toList();
  }

  private List<Donation> filterValidDonation(List<Donation> donations) {
    return donations.stream()
        .filter(Donation::isValid).toList();
  }

  private List<Refund> filterValidRefund(List<Refund> refunds) {
    return refunds.stream()
        .filter(Refund::isValid).toList();
  }
}

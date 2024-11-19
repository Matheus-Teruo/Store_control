package com.storecontrol.backend.services.customers;

import com.storecontrol.backend.controllers.customers.request.RequestCustomer;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.operations.Donation;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.operations.Refund;
import com.storecontrol.backend.repositories.customers.CustomerRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class CustomerService {

  @Autowired
  CustomerRepository repository;

  @Autowired
  OrderCardService orderCardService;

  @Transactional
  public Customer initializeCustomer(RequestCustomer request) {
    var orderCard = orderCardService.takeOrderCardById(request.orderCard().id());

    orderCard.incrementDebit(new BigDecimal(request.orderCard().debit()));
    orderCard.updateActive(true);
    var customer = new Customer(orderCard);

    repository.save(customer);

    return customer;
  }

  public Customer takeFilteredCustomerByUuid(String uuid) {
    var customer = repository.findById(UUID.fromString(uuid))
        .orElseThrow(() -> new RuntimeException("Customer not found"));

    filterCustomerToDiscardInactiveRelations(customer);

    return customer;
  }

  public Customer takeActiveCustomerByCardId(String cardId) {
    return repository.findByOrderCardIdActiveTrue(cardId)
        .orElseThrow(() -> new RuntimeException("Customer not found"));
  }

  public Customer takeLastActiveFilteredCustomerByCardId(String cardId) {
    var customer = repository.findByOrderCardId(cardId)
        .orElseThrow(() -> new RuntimeException("Customer not found"));

    filterCustomerToDiscardInactiveRelations(customer);

    return customer;
  }

  public Customer takeActiveFilteredCustomerByCardId(String cardId) {
    var customer = repository.findByOrderCardIdActiveTrue(cardId)
        .orElseThrow(() -> new RuntimeException("Customer not found"));

    filterCustomerToDiscardInactiveRelations(customer);

    return customer;
  }

  public List<Customer> listActiveCustomers() {
    return repository.findAllActiveTrue();
  }

  public List<Customer> listCustomers() {
    return repository.findAll();
  }

  @Transactional
  public void finalizeCustomer(Customer customer) {
    if (customer.getOrderCard().getDebit().compareTo(BigDecimal.ZERO) != 0) {
      // TODO: system error, customer can't finalize with debit.
    }

    customer.getOrderCard().updateActive(false);
    customer.finalizeCustomer();
  }

  @Transactional
  public void undoFinalizeCustomer(Customer customer) {
    if (customer.getOrderCard().getDebit().compareTo(BigDecimal.ZERO) != 0) {
      // TODO: system error, customer can't finalize with debit.
    }

    customer.getOrderCard().updateActive(true);
    customer.undoFinalizeCustomer();
    filterCustomerToDiscardInactiveRelations(customer);
  }

  private void filterCustomerToDiscardInactiveRelations(Customer customer) {
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

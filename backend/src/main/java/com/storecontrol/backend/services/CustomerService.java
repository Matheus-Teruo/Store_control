package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.customer.RequestCustomer;
import com.storecontrol.backend.models.Customer;
import com.storecontrol.backend.repositories.CustomerRepository;
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

  public Customer takeActiveCustomerByCardId(String cardId) {
    var customerOptional = repository.findByOrderCardIdActiveTrue(cardId);

    return customerOptional.orElseGet(Customer::new);  // TODO: ERROR: card_id invalid
  }

  public Customer takeAnyCustomer(String uuid) {
    var customerOptional = repository.findById(UUID.fromString(uuid));

    return customerOptional.orElseGet(Customer::new);  // TODO: ERROR: customer_uuid invalid
  }

  public List<Customer> listCustomers() {
    return repository.findAllActiveTrue();
  }
}

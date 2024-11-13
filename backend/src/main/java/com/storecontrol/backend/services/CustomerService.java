package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.customer.RequestCustomer;
import com.storecontrol.backend.models.Customer;
import com.storecontrol.backend.repositories.CustomerRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CustomerService {

  @Autowired
  CustomerRepository repository;

  @Autowired
  OrderCardService orderCardService;

  @Transactional
  public Customer initializeCustomer(RequestCustomer request) {
    var orderCard = orderCardService.updateOrderCard(request.orderCard());
    var customer = new Customer(request, orderCard);
    repository.save(customer);

    return customer;
  }

//  public Customer takeActiveCustomer(String uuid) {
//    return repository.findByIdActiveTrue(UUID.fromString(uuid));
//  }

  public Customer takeActiveCustomerByCardId(String cardId) {
    return repository.findByOrderCardIdActiveTrue(cardId);
  }

  public Customer takeAnyCustomer(String uuid) {
    var customerOptional = repository.findById(UUID.fromString(uuid));

    return customerOptional.orElseGet(Customer::new);
  }

  public List<Customer> listCustomers() {
    return repository.findAllByActiveTrue();
  }

  @Transactional
  public Customer finalizeCustomer(String uuid) {
    Optional<Customer> standOptional = repository.findById(UUID.fromString(uuid));

    if (standOptional.isPresent()) {
      var customer = standOptional.get();
      orderCardService.deactivateOrderCard(customer.getOrderCard().getId());

      customer.finalizeCustomer();

      return customer;
    } else {
      // TODO: erro de ID errado
      return new Customer();
    }
  }
}

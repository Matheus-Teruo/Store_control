package com.storecontrol.backend.services.customers;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidCustomerException;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.repositories.customers.CustomerRepository;
import com.storecontrol.backend.services.customers.component.CustomerFilter;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class CustomerService {

  @Autowired
  CustomerFilter filter;

  @Autowired
  CustomerRepository repository;

  @Autowired
  OrderCardService orderCardService;

  @Transactional
  public Customer initializeCustomer(String cardId) {
    var orderCard = orderCardService.safeTakeOrderCardById(cardId);

    orderCard.updateActive(true);
    var customer = new Customer(orderCard);

    repository.save(customer);

    return customer;
  }

  public Customer takeFilteredCustomerByUuid(UUID uuid) {
    var customer = repository.findById(uuid)
        .orElseThrow(EntityNotFoundException::new);

    filter.filterInactiveRelations(customer);

    return customer;
  }

  public Customer takeActiveCustomerByCardId(String cardId) {
    return repository.findByOrderCardIdActiveTrue(cardId)
        .orElseThrow(() -> new InvalidDatabaseQueryException(
            MessageResolver.getInstance().getMessage("service.exception.customer.get.validation.error"),
            MessageResolver.getInstance().getMessage("service.exception.customer.get.validation.message"),
            cardId)
        );
  }

  public Customer takeLastActiveFilteredCustomerByCardId(String cardId) {
    var customer = repository.findByOrderCardId(cardId)
        .orElseThrow(() -> new InvalidDatabaseQueryException(
            MessageResolver.getInstance().getMessage("service.exception.customer.get.validation.error"),
            MessageResolver.getInstance().getMessage("service.exception.customer.get.validation.message"),
            cardId));

    filter.filterInactiveRelations(customer);

    return customer;
  }

  public Customer takeActiveFilteredCustomerByCardId(String cardId) {
    var customer = takeActiveCustomerByCardId(cardId);

    filter.filterInactiveRelations(customer);

    return customer;
  }

  public Page<Customer> pageActiveCustomers(Pageable pageable) {
    return repository.findAllActiveTrue(pageable);
  }

  public Page<Customer> pageCustomers(Pageable pageable) {
    return repository.findAll(pageable);
  }

  @Transactional
  public void finalizeCustomer(Customer customer) {
    if (customer.getOrderCard().getDebit().compareTo(BigDecimal.ZERO) != 0) {
      throw new InvalidCustomerException(
          MessageResolver.getInstance().getMessage("service.exception.customer.finalize.validation.error"),
          MessageResolver.getInstance().getMessage("service.exception.customer.finalize.validation.message")
      );
    }

    customer.getOrderCard().updateActive(false);
    customer.finalizeCustomer();
  }

  @Transactional
  public void undoFinalizeCustomer(Customer customer) {

    customer.getOrderCard().updateActive(true);
    customer.undoFinalizeCustomer();
    filter.filterInactiveRelations(customer);
  }
}

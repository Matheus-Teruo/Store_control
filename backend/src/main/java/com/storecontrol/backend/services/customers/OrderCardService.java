package com.storecontrol.backend.services.customers;

import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.customers.OrderCard;
import com.storecontrol.backend.models.customers.request.RequestOrderCard;
import com.storecontrol.backend.repositories.customers.OrderCardRepository;
import com.storecontrol.backend.services.customers.validation.OrderCardValidation;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderCardService {

  @Autowired
  OrderCardValidation validation;

  @Autowired
  OrderCardRepository repository;

  @Transactional
  public OrderCard createOrderCard(RequestOrderCard request) {
    validation.checkNameDuplication(request.id());
    var orderCard = new OrderCard(request);
    repository.save(orderCard);

    return orderCard;
  }

  public OrderCard takeOrderCardById(String cardId) {
    return repository.findById(cardId)
        .orElseThrow(EntityNotFoundException::new);
  }

  public OrderCard safeTakeOrderCardById(String cardId) {
    return repository.findById(cardId)
        .orElseThrow(() -> new InvalidDatabaseQueryException("Non-existent entity" , "OrderCard", cardId));
  }

  public List<OrderCard> listAllOrderCards() {
    return repository.findAll();
  }

  public List<OrderCard> listActiveOrderCards() {
    return repository.findAllActiveTrue();
  }
}

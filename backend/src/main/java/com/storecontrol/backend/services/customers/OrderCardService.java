package com.storecontrol.backend.services.customers;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.customers.OrderCard;
import com.storecontrol.backend.models.customers.request.RequestOrderCard;
import com.storecontrol.backend.repositories.customers.OrderCardRepository;
import com.storecontrol.backend.services.customers.component.OrderCardValidation;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class OrderCardService {

  @Autowired
  OrderCardValidation validation;

  @Autowired
  OrderCardRepository repository;

  @Transactional
  public OrderCard createOrderCard(RequestOrderCard request) {
    validation.checkNameDuplication(request.cardId());
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
        .orElseThrow(() -> new InvalidDatabaseQueryException(
            MessageResolver.getInstance().getMessage("service.exception.oderCard.get.validation.error"),
            MessageResolver.getInstance().getMessage("service.exception.oderCard.get.validation.message"),
            cardId)
        );
  }

  public Page<OrderCard> pageAllOrderCards(Pageable pageable) {
    return repository.findAll(pageable);
  }

  public Page<OrderCard> pageActiveOrderCards(Pageable pageable) {
    return repository.findAllActiveTrue(pageable);
  }
}

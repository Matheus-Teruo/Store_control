package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.orderCard.RequestOrderCard;
import com.storecontrol.backend.controllers.request.orderCard.RequestUpdateOrderCard;
import com.storecontrol.backend.models.OrderCard;
import com.storecontrol.backend.repositories.OrderCardRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderCardService {

  @Autowired
  OrderCardRepository repository;

  @Transactional
  public OrderCard createOrderCard(RequestOrderCard request) {
    var orderCard = new OrderCard(request);
    repository.save(orderCard);

    return orderCard;
  }

  public OrderCard takeOrderCard(String id) {
    var orderCard = repository.findByIdActiveTrue(id);

    return orderCard.orElseGet(OrderCard::new);
  }

  public List<OrderCard> listAllOrderCards() {
    return repository.findAll();
  }

  public List<OrderCard> listActiveOrderCards() {
    return repository.findAllByActiveTrue();
  }

  @Transactional
  public OrderCard updateOrderCard(RequestUpdateOrderCard request) {
    Optional<OrderCard> orderCard = repository.findById(request.id());

    if (orderCard.isPresent()) {
      orderCard.get().updateOrderCard(request);
      return orderCard.get();
    } else {
      return new OrderCard();
    }
  }

  @Transactional
  public void updateDebitOrderCard(String cardId, String debitUpdateValue) {
    Optional<OrderCard> orderCard = repository.findByIdActiveTrue(cardId);

    orderCard.ifPresent(card -> card.incrementDebit(debitUpdateValue));
  }

  @Transactional
  public void deactivateOrderCard(String cardId) {
    var orderCard = takeOrderCard(cardId);

    orderCard.updateOrderCard(
        new RequestUpdateOrderCard(cardId, "0", false));
  }
}

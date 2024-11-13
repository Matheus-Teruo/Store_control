package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.orderCard.RequestOrderCard;
import com.storecontrol.backend.controllers.request.orderCard.RequestUpdateOrderCard;
import com.storecontrol.backend.models.OrderCard;
import com.storecontrol.backend.repositories.OrderCardRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

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

  public OrderCard takeOrderCardById(String uuid) {
    var orderCardOptional = repository.findByIdActiveTrue(uuid);

    return orderCardOptional.orElseGet(OrderCard::new); // TODO: ERROR: card_id invalid
  }

  public List<OrderCard> listAllOrderCards() {
    return repository.findAll();
  }

  public List<OrderCard> listActiveOrderCards() {
    return repository.findAllActiveTrue();
  }

  @Transactional
  public OrderCard updateOrderCard(RequestUpdateOrderCard request) {
    var card = takeOrderCardById(request.id());

    card.updateOrderCard(request);

    return card;
  }

  @Transactional
  public void updateDebitOrderCard(String cardId, String debitUpdateValue) {
    var orderCard = takeOrderCardById(cardId);

    orderCard.incrementDebit(debitUpdateValue);
  }

  @Transactional
  public BigDecimal deactivateOrderCard(String cardId) {
    var orderCard = takeOrderCardById(cardId);
    var remainingDebit = orderCard.getDebit();

    orderCard.updateOrderCard(
        new RequestUpdateOrderCard(
            cardId,
            "0",
            false
        )
    );

    return remainingDebit;
  }
}

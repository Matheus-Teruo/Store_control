package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.orderCard.RequestUpdateCard;
import com.storecontrol.backend.controllers.response.orderCard.ResponseCard;
import com.storecontrol.backend.models.OrderCard;
import com.storecontrol.backend.repositories.OrderCardRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class OrderCardService {

  @Autowired
  OrderCardRepository repository;

  @Transactional
  public ResponseCard serviceUptadeCard(RequestUpdateCard request) {
    Optional<OrderCard> orderCard = repository.findById(UUID.fromString(request.id()));

    if (orderCard.isPresent()) {
      orderCard.get().updateOrderCard(request);
      return new ResponseCard(orderCard.get());
    } else {
      return new ResponseCard(new OrderCard());
    }
  }
}

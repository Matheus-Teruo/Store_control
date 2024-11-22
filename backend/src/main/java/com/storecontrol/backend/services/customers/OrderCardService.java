package com.storecontrol.backend.services.customers;

import com.storecontrol.backend.models.customers.request.RequestOrderCard;
import com.storecontrol.backend.models.customers.OrderCard;
import com.storecontrol.backend.repositories.customers.OrderCardRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    var orderCardOptional = repository.findById(uuid);

    return orderCardOptional.orElseGet(OrderCard::new); // TODO: ERROR: card_id don't exist
  }

  public List<OrderCard> listAllOrderCards() {
    return repository.findAll();
  }

  public List<OrderCard> listActiveOrderCards() {
    return repository.findAllActiveTrue();
  }
}

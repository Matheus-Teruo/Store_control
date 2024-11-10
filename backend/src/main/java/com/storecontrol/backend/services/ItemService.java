package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.item.RequestUpdateItem;
import com.storecontrol.backend.controllers.response.item.ResponseItem;
import com.storecontrol.backend.models.Item;
import com.storecontrol.backend.repositories.ItemRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class ItemService {

  @Autowired
  ItemRepository repository;

  @Transactional
  public ResponseItem serviceUptadeItem(RequestUpdateItem request) {
    Optional<Item> item = repository.findById(UUID.fromString(request.uuid()));

    if (item.isPresent()) {
      item.get().updateItem(request);
      return new ResponseItem(item.get());
    } else {
      return new ResponseItem(new Item());
    }
  }

  public void serviceDeleteItem(RequestUpdateItem request) {
    Optional<Item> item = repository.findById(UUID.fromString(request.uuid()));

    item.ifPresent(Item::deleteItem);
  }
}

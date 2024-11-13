package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.item.RequestItem;
import com.storecontrol.backend.controllers.request.item.RequestUpdateItem;
import com.storecontrol.backend.models.Item;
import com.storecontrol.backend.repositories.ItemRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ItemService {

  @Autowired
  ItemRepository repository;

  @Autowired
  StandService standService;

  @Transactional
  public Item createItem(RequestItem request) {
    var stand = standService.takeStand(request.standId());
    var item = new Item(request, stand);
    repository.save(item);

    return item;
  }

  public Item takeItem(String uuid) {
    return repository.findByIdValidTrue(UUID.fromString(uuid));
  }

  public List<Item> listItems() {
    return repository.findAllByValidTrue();
  }

  @Transactional
  public Item updateItem(RequestUpdateItem request) {
    Optional<Item> itemOptional = repository.findById(UUID.fromString(request.uuid()));

    if (itemOptional.isPresent()) {
      var item = itemOptional.get();
      item.updateItem(request);

      verifyUpdateItem(request.standId(), item);

      return item;
    } else {
      return new Item();
    }
  }

  @Transactional
  public void deleteItem(RequestUpdateItem request) {
    Optional<Item> item = repository.findById(UUID.fromString(request.uuid()));

    item.ifPresent(Item::deleteItem);
  }

  private void verifyUpdateItem(String uuid, Item item) {
    if (uuid != null) {
      var stand = standService.takeStand(uuid);

      item.updateItem(stand);
    }
  }
}

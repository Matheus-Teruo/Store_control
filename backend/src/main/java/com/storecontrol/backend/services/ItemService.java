package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.item.RequestItem;
import com.storecontrol.backend.controllers.request.item.RequestUpdateItem;
import com.storecontrol.backend.models.Item;
import com.storecontrol.backend.repositories.ItemRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ItemService {

  @Autowired
  ItemRepository repository;

  @Autowired
  StandService standService;

  @Transactional
  public Item createItem(RequestItem request) {
    var stand = standService.takeStandByUuid(request.standId());
    var item = new Item(request, stand);
    repository.save(item);

    return item;
  }

  public Item takeItemByUuid(String uuid) {
    var itemOptional = repository.findByUuidValidTrue(UUID.fromString(uuid));

    return itemOptional.orElseGet(Item::new);  // TODO: ERROR: item_uuid invalid
  }

  public List<Item> listItems() {
    return repository.findAllValidTrue();
  }

  @Transactional
  public Item updateItem(RequestUpdateItem request) {
    var item = takeItemByUuid(request.uuid());

    item.updateItem(request);
    updateStandFromItem(request.standId(), item);

    return item;
  }

  @Transactional
  public void deleteItem(RequestUpdateItem request) {
    var item = takeItemByUuid(request.uuid());

    item.deleteItem();
  }

  private void updateStandFromItem(String uuid, Item item) {
    if (uuid != null) {
      var stand = standService.takeStandByUuid(uuid);

      item.updateItem(stand);
    }
  }
}

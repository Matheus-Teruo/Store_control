package com.storecontrol.backend.controllers;

import com.storecontrol.backend.controllers.request.item.RequestItem;
import com.storecontrol.backend.controllers.request.item.RequestUpdateItem;
import com.storecontrol.backend.controllers.response.item.ResponseItem;
import com.storecontrol.backend.controllers.response.item.ResponseSummaryItem;
import com.storecontrol.backend.models.Item;
import com.storecontrol.backend.repositories.ItemRepository;
import com.storecontrol.backend.services.ItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("items")
public class ItemController {

  @Autowired
  ItemService service;

  @Autowired
  ItemRepository repository;

  @PostMapping
  public ResponseEntity<ResponseItem> createItem(@RequestBody @Valid RequestItem request) {
    var item = new Item(request);
    repository.save(item);

    var response = new ResponseItem(item);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{id}")
  public ResponseEntity<ResponseItem> readItem(@PathVariable UUID id) {
    var item = repository.findByIdValidTrue(id);

    var response = new ResponseItem(item);
    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseSummaryItem>> readItems() {
    var items = repository.findAllByValidTrue();

    var response = items.stream().map(ResponseSummaryItem::new).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponseItem> updateItem(@RequestBody @Valid RequestUpdateItem request) {
    var response = service.serviceUptadeItem(request);

    return ResponseEntity.ok(response);
  }

  @DeleteMapping
  public ResponseEntity<Void> deleteItem(@RequestBody @Valid RequestUpdateItem request) {
    service.serviceDeleteItem(request);

    return ResponseEntity.noContent().build();
  }
}

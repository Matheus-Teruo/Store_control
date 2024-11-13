package com.storecontrol.backend.controllers;

import com.storecontrol.backend.controllers.request.item.RequestItem;
import com.storecontrol.backend.controllers.request.item.RequestUpdateItem;
import com.storecontrol.backend.controllers.response.item.ResponseItem;
import com.storecontrol.backend.controllers.response.item.ResponseSummaryItem;
import com.storecontrol.backend.services.ItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("items")
public class ItemController {

  @Autowired
  ItemService service;

  @PostMapping
  public ResponseEntity<ResponseItem> createItem(@RequestBody @Valid RequestItem request) {
    var response = new ResponseItem(service.createItem(request));

    return ResponseEntity.ok(response);
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseItem> readItem(@PathVariable String uuid) {
    var response = new ResponseItem(service.takeItem(uuid));
    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseSummaryItem>> readItems() {
    var items = service.listItems();

    var response = items.stream().map(ResponseSummaryItem::new).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponseItem> updateItem(@RequestBody @Valid RequestUpdateItem request) {
    var response = new ResponseItem(service.updateItem(request));

    return ResponseEntity.ok(response);
  }

  @DeleteMapping
  public ResponseEntity<Void> deleteItem(@RequestBody @Valid RequestUpdateItem request) {
    service.deleteItem(request);

    return ResponseEntity.noContent().build();
  }
}

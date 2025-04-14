package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestUpdatePurchase;
import com.storecontrol.backend.models.operations.purchases.response.ResponsePurchase;
import com.storecontrol.backend.models.operations.purchases.response.ResponseSummaryPurchase;
import com.storecontrol.backend.services.operations.PurchaseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("purchases")
public class PurchaseController {

  @Autowired
  private PurchaseService service;

  @PostMapping
  public ResponseEntity<ResponsePurchase> createPurchase(@RequestBody @Valid RequestCreatePurchase request) {
    var purchase = service.createPurchase(request);

    URI location = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .path("/{uuid}")
        .buildAndExpand(purchase.getUuid())
        .toUri();

    return ResponseEntity.created(location).body(new ResponsePurchase(purchase));
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponsePurchase> readPurchase(@PathVariable @Valid UUID uuid) {
    var response = new ResponsePurchase(service.takePurchaseByUuid(uuid));

    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<Page<ResponseSummaryPurchase>> readPurchases(
      @RequestParam(required = false) UUID standUuid,
      Pageable pageable) {
    var purchases = service.pagePurchases(standUuid, pageable);

    var response = purchases.map(ResponseSummaryPurchase::new);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/last3")
  public ResponseEntity<List<ResponseSummaryPurchase>> readLast3Purchases() {
    var purchases = service.listLast3Purchases();

    var response = purchases.stream().map(ResponseSummaryPurchase::new).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponsePurchase> updatePurchase(@RequestBody @Valid RequestUpdatePurchase request) {
    var response = new ResponsePurchase(service.updatePurchase(request));

    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{uuid}")
  public ResponseEntity<Void> deletePurchase(@PathVariable @Valid UUID uuid) {
    service.deletePurchase(uuid);

    return ResponseEntity.noContent().build();
  }
}

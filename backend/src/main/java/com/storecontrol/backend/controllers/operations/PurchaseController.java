package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestUpdatePurchase;
import com.storecontrol.backend.models.operations.purchases.response.ResponsePurchase;
import com.storecontrol.backend.models.operations.purchases.response.ResponseSummaryPurchase;
import com.storecontrol.backend.services.operations.PurchaseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
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
  PurchaseService service;

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
  public ResponseEntity<ResponsePurchase> readPurchase(@PathVariable UUID uuid) {
    var response = new ResponsePurchase(service.takePurchaseByUuid(uuid));

    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseSummaryPurchase>> readPurchases() {
    var purchases = service.listPurchases();

    var response = purchases.stream().map(ResponseSummaryPurchase::new).toList();
    return ResponseEntity.ok(response);
  }

  @GetMapping("/last3")
  public ResponseEntity<List<ResponseSummaryPurchase>> readLast3Purchases(@RequestAttribute("UserUuid") String userUuid) {
    var purchases = service.listLast3Purchases(UUID.fromString(userUuid));

    var response = purchases.stream().map(ResponseSummaryPurchase::new).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponsePurchase> updatePurchase(@RequestBody @Valid RequestUpdatePurchase request) {
    var response = new ResponsePurchase(service.updatePurchase(request));

    return ResponseEntity.ok(response);
  }

  @DeleteMapping
  public ResponseEntity<Void> deletePurchase(@RequestBody @Valid RequestUpdatePurchase request) {
    service.deletePurchase(request);

    return ResponseEntity.noContent().build();
  }
}

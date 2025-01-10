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
  PurchaseService service;

  @PostMapping
  public ResponseEntity<ResponsePurchase> createPurchase(
      @RequestBody @Valid RequestCreatePurchase request,
      @RequestAttribute("UserUuid") UUID userUuid
  ) {
    var purchase = service.createPurchase(request, userUuid);

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
  public ResponseEntity<Page<ResponseSummaryPurchase>> readPurchases(Pageable pageable) {
    var purchases = service.pagePurchases(pageable);

    var response = purchases.map(ResponseSummaryPurchase::new);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/last3")
  public ResponseEntity<List<ResponseSummaryPurchase>> readLast3Purchases(@RequestAttribute("UserUuid") UUID userUuid) {
    var purchases = service.listLast3Purchases(userUuid);

    var response = purchases.stream().map(ResponseSummaryPurchase::new).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponsePurchase> updatePurchase(@RequestBody @Valid RequestUpdatePurchase request) {
    var response = new ResponsePurchase(service.updatePurchase(request));

    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{uuid}")
  public ResponseEntity<Void> deletePurchase(
      @PathVariable @Valid UUID uuid,
      @RequestAttribute("UserUuid") UUID userUuid
  ) {
    service.deletePurchase(uuid, userUuid);

    return ResponseEntity.noContent().build();
  }
}

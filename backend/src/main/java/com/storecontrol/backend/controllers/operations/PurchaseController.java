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

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("purchases")
public class PurchaseController {

  @Autowired
  PurchaseService service;

  @PostMapping
  public ResponseEntity<ResponsePurchase> createPurchase(@RequestBody @Valid RequestCreatePurchase request) {
    var response = new ResponsePurchase(service.createPurchase(request));

    return ResponseEntity.ok(response);
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponsePurchase> readPurchase(@PathVariable UUID uuid) {
    var response = new ResponsePurchase(service.takePurchaseByUuid(uuid));

    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseSummaryPurchase>> readPurchases() {
    var Sales = service.listPurchases();

    var response = Sales.stream().map(ResponseSummaryPurchase::new).toList();
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

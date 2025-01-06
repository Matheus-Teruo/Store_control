package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.models.operations.request.RequestCreateTransaction;
import com.storecontrol.backend.models.operations.request.RequestDeleteTransaction;
import com.storecontrol.backend.models.operations.response.ResponseSummaryRecharge;
import com.storecontrol.backend.models.operations.response.ResponseSummaryTransaction;
import com.storecontrol.backend.models.operations.response.ResponseTransaction;
import com.storecontrol.backend.models.registers.response.ResponseCashRegister;
import com.storecontrol.backend.services.operations.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("transactions")
public class TransactionController {

  @Autowired
  TransactionService service;

  @PostMapping
  public ResponseEntity<ResponseTransaction> createTransaction(
      @RequestBody @Valid RequestCreateTransaction request,
      @RequestAttribute("UserUuid") UUID userUuid
  ) {
    var transaction = service.createTransaction(request, userUuid);

    URI location = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .path("/{uuid}")
        .buildAndExpand(transaction.getUuid())
        .toUri();

    return ResponseEntity.created(location).body(new ResponseTransaction(transaction));
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseTransaction> readTransaction(@PathVariable @Valid UUID uuid) {
    var response = new ResponseTransaction(service.takeTransactionByUuid(uuid));

    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseSummaryTransaction>> readTransactions() {
    var transactions = service.listTransactions();

    var response = transactions.stream().map(ResponseSummaryTransaction::new).toList();
    return ResponseEntity.ok(response);
  }

  @GetMapping("/last3")
  public ResponseEntity<List<ResponseSummaryTransaction>> readLast3Purchases(@RequestAttribute("UserUuid") String userUuid) {
    var transactions = service.listLast3Purchases(UUID.fromString(userUuid));

    var response = transactions.stream().map(ResponseSummaryTransaction::new).toList();
    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{uuid}")
  public ResponseEntity<Void> deleteTransaction(
      @PathVariable @Valid UUID uuid,
      @RequestAttribute("UserUuid") UUID userUuid
  ) {
    service.deleteTransaction(uuid, userUuid);

    return ResponseEntity.noContent().build();
  }
}

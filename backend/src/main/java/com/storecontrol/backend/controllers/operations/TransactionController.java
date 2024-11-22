package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.models.operations.request.RequestDeleteTransaction;
import com.storecontrol.backend.models.operations.request.RequestTransaction;
import com.storecontrol.backend.models.operations.response.ResponseSummaryTransaction;
import com.storecontrol.backend.models.operations.response.ResponseTransaction;
import com.storecontrol.backend.services.operations.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("transactions")
public class TransactionController {

  @Autowired
  TransactionService service;

  @PostMapping
  public ResponseEntity<ResponseTransaction> createTransaction(@RequestBody @Valid RequestTransaction request) {
    var response = new ResponseTransaction(service.createTransaction(request));

    return ResponseEntity.ok(response);
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseTransaction> readTransaction(@PathVariable String uuid) {
    var response = new ResponseTransaction(service.takeTransactionByUuid(uuid));

    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseSummaryTransaction>> readTransactions() {
    var transaction = service.listTransactions();

    var response = transaction.stream().map(ResponseSummaryTransaction::new).toList();
    return ResponseEntity.ok(response);
  }

  @DeleteMapping
  public ResponseEntity<Void> deleteTransaction(@RequestBody @Valid RequestDeleteTransaction request) {
    service.deleteTransaction(request);

    return ResponseEntity.noContent().build();
  }
}

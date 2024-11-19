package com.storecontrol.backend.services.operations;

import com.storecontrol.backend.controllers.operations.request.RequestDeleteTransaction;
import com.storecontrol.backend.controllers.operations.request.RequestTransaction;
import com.storecontrol.backend.models.operations.Transaction;
import com.storecontrol.backend.repositories.operations.TransactionRepository;
import com.storecontrol.backend.services.registers.CashRegisterService;
import com.storecontrol.backend.services.validation.TransactionValidate;
import com.storecontrol.backend.services.volunteers.VoluntaryService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class TransactionService {

  @Autowired
  TransactionValidate validate;

  @Autowired
  TransactionRepository repository;

  @Autowired
  CashRegisterService cashRegisterService;

  @Autowired
  VoluntaryService voluntaryService;

  @Transactional
  public Transaction createTransaction(RequestTransaction request) {
    var voluntary = voluntaryService.takeVoluntaryByUuid(request.voluntaryId());
//    var function = voluntary.getFunction();
//    if (function instanceof CashRegister) {
//
//    }
    var cashRegister = cashRegisterService.takeCashRegisterByUuid(request.cashRegisterId());

    validate.checkCashAvailableToTransaction(request, cashRegister);

    var transaction = new Transaction(request, cashRegister, voluntary);
    handleCashTotal(transaction, !transaction.getTransactionTypeEnum().isExit());
    repository.save(transaction);

    return transaction;
  }

  public Transaction takeTransactionByUuid(String uuid) {
    var transactionOptional = repository.findByUuidValidTrue(UUID.fromString(uuid));

    return transactionOptional.orElseGet(Transaction::new);  // TODO: ERROR: recharge_uuid invalid
  }

  public List<Transaction> listTransactions() {
    return repository.findAllValidTrue();
  }

  @Transactional
  public void deleteTransaction(RequestDeleteTransaction request) {
    var transaction = takeTransactionByUuid(request.uuid());

    handleCashTotal(transaction, transaction.getTransactionTypeEnum().isExit());

    transaction.deleteTransaction();
  }

  private void handleCashTotal(Transaction transaction, Boolean isReversal) {

    BigDecimal adjustmentFactor = isReversal ? BigDecimal.ONE : BigDecimal.ONE.negate();

    transaction.getCashRegister().incrementCash(transaction.getAmount().multiply(adjustmentFactor));
  }
}

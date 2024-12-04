package com.storecontrol.backend.services.operations;

import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.operations.Transaction;
import com.storecontrol.backend.models.operations.request.RequestCreateTransaction;
import com.storecontrol.backend.models.operations.request.RequestDeleteTransaction;
import com.storecontrol.backend.repositories.operations.TransactionRepository;
import com.storecontrol.backend.services.operations.validation.TransactionValidation;
import com.storecontrol.backend.services.registers.CashRegisterService;
import com.storecontrol.backend.services.volunteers.VoluntaryService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class TransactionService {

  @Autowired
  TransactionValidation validate;

  @Autowired
  TransactionRepository repository;

  @Autowired
  CashRegisterService cashRegisterService;

  @Autowired
  VoluntaryService voluntaryService;

  @Transactional
  public Transaction createTransaction(RequestCreateTransaction request) {
    var voluntary = voluntaryService.safeTakeVoluntaryByUuid(request.voluntaryId());
    var cashRegister = cashRegisterService.safeTakeCashRegisterByUuid(request.cashRegisterId());

    validate.checkVoluntaryFunctionMatch(voluntary);
    validate.checkCashAvailableToTransaction(
        request.amount(),
        request.transactionTypeEnum(),
        cashRegister,
        false);

    var transaction = new Transaction(request, cashRegister, voluntary);
    handleCashTotal(transaction, !transaction.getTransactionTypeEnum().isExit());
    repository.save(transaction);

    return transaction;
  }

  public Transaction takeTransactionByUuid(UUID uuid) {
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(EntityNotFoundException::new);
  }

  public Transaction safeTakeTransactionByUuid(UUID uuid) {
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(() -> new InvalidDatabaseQueryException("Non-existent entity", "Transaction", uuid.toString()));
  }

  public List<Transaction> listTransactions() {
    return repository.findAllValidTrue();
  }

  public List<Transaction> listLast3Purchases(UUID voluntaryUuid) {
    return repository.findLast3ValidTrue(voluntaryUuid);
  }

  @Transactional
  public void deleteTransaction(RequestDeleteTransaction request) {
    var transaction = safeTakeTransactionByUuid(request.uuid());

    validate.checkCashAvailableToTransaction(
        transaction.getAmount(),
        transaction.getTransactionTypeEnum().toString(),
        transaction.getCashRegister(),
        true);
    handleCashTotal(transaction, transaction.getTransactionTypeEnum().isExit());

    transaction.deleteTransaction();
  }

  private void handleCashTotal(Transaction transaction, Boolean isReversal) {

    BigDecimal adjustmentFactor = isReversal ? BigDecimal.ONE : BigDecimal.ONE.negate();

    transaction.getCashRegister().incrementCash(transaction.getAmount().multiply(adjustmentFactor));
  }
}

package com.storecontrol.backend.services.operations;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
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
  TransactionValidation validation;

  @Autowired
  TransactionRepository repository;

  @Autowired
  CashRegisterService cashRegisterService;

  @Autowired
  VoluntaryService voluntaryService;

  @Transactional
  public Transaction createTransaction(RequestCreateTransaction request, UUID userUuid) {
    var voluntary = voluntaryService.safeTakeVoluntaryByUuid(userUuid);
    var cashRegister = cashRegisterService.safeTakeCashRegisterByUuid(request.cashRegisterUuid());

    validation.checkVoluntaryFunctionType(voluntary);
    validation.checkCashAvailableToTransaction(
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
        .orElseThrow(() -> new InvalidDatabaseQueryException(
            MessageResolver.getInstance().getMessage("service.exception.transaction.get.validation.error"),
            MessageResolver.getInstance().getMessage("service.exception.transaction.get.validation.message"),
            uuid.toString())
        );
  }

  public List<Transaction> listTransactions() {
    return repository.findAllValidTrue();
  }

  public List<Transaction> listLast3Purchases(UUID voluntaryUuid) {
    return repository.findLast3ValidTrue(voluntaryUuid);
  }

  @Transactional
  public void deleteTransaction(RequestDeleteTransaction request, UUID userUuid) {
    var transaction = safeTakeTransactionByUuid(request.uuid());
    var voluntary = voluntaryService.safeTakeVoluntaryByUuid(userUuid);

    validation.checkCashAvailableToTransaction(
        transaction.getAmount(),
        transaction.getTransactionTypeEnum().toString(),
        transaction.getCashRegister(),
        true);
    validation.checkTransactionBelongsToVoluntary(transaction, userUuid);
    validation.checkIfLastTransactionOfVoluntary(transaction, voluntary);

    handleCashTotal(transaction, transaction.getTransactionTypeEnum().isExit());

    transaction.deleteTransaction();
  }

  private void handleCashTotal(Transaction transaction, Boolean isReversal) {

    BigDecimal adjustmentFactor = isReversal ? BigDecimal.ONE : BigDecimal.ONE.negate();

    transaction.getCashRegister().incrementCash(transaction.getAmount().multiply(adjustmentFactor));
  }
}

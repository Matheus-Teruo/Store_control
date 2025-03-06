package com.storecontrol.backend.services.operations.validation;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidOperationException;
import com.storecontrol.backend.models.enumerate.TransactionType;
import com.storecontrol.backend.models.operations.Transaction;
import com.storecontrol.backend.models.registers.CashRegister;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.repositories.operations.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@Component
public class TransactionValidation {

  @Autowired
  TransactionRepository repository;

  public void checkCashAvailableToTransaction(
      BigDecimal amount,
      String transactionTypeEnum,
      CashRegister cashRegister,
      Boolean isDelete) {
    var cashTotal = cashRegister.getCashTotal();
    var transactionType = TransactionType.fromString(transactionTypeEnum);
    boolean aux = isDelete ? transactionType == TransactionType.ENTRY : transactionType == TransactionType.EXIT;
    if (aux && amount.compareTo(cashTotal) > 0) {
      throw new InvalidOperationException(
          MessageResolver.getInstance().getMessage("validation.transaction.checkCash.notEnoughCash.error"),
          MessageResolver.getInstance().getMessage("validation.transaction.checkCash.notEnoughCash.message")
      );
    }
  }

  public void checkVoluntaryFunctionType(Voluntary voluntary) {
    if (voluntary.getVoluntaryRole().isNotAdmin()) {
      if ((voluntary.getFunction() == null)) {
        throw new InvalidOperationException(
            MessageResolver.getInstance().getMessage("validation.transaction.checkVoluntary.functionNull.error"),
            MessageResolver.getInstance().getMessage("validation.transaction.checkVoluntary.functionNull.message")
        );
      } else {
        if (!(voluntary.getFunction() instanceof CashRegister)) {
          throw new InvalidOperationException(
              MessageResolver.getInstance().getMessage("validation.transaction.checkVoluntary.functionDifferent.error"),
              MessageResolver.getInstance().getMessage("validation.transaction.checkVoluntary.functionDifferent.message")
          );
        }
      }
    }
  }

  public void checkTransactionBelongsToVoluntary(Transaction transaction, UUID userUuid) {
    if (transaction.getVoluntary().getVoluntaryRole().isNotAdmin() && !transaction.getVoluntary().getUuid().equals(userUuid)) {
      throw new InvalidOperationException(
          MessageResolver.getInstance().getMessage("validation.transaction.checkVoluntary.notOwner.error"),
          MessageResolver.getInstance().getMessage("validation.transaction.checkVoluntary.notOwner.message")
      );
    }
  }

  public void checkIfLastTransactionOfVoluntary(Transaction transaction, Voluntary voluntary) {
    if (voluntary.getVoluntaryRole().isNotAdmin()) {
      Optional<Transaction> optionalTransaction = repository.findLastFromVoluntary(voluntary.getUuid());

      if (optionalTransaction.isPresent()) {
        if (!optionalTransaction.get().getUuid().equals(transaction.getUuid())) {
          throw new InvalidOperationException(
              MessageResolver.getInstance().getMessage("validation.transaction.checkLastTransaction.notLast.error"),
              MessageResolver.getInstance().getMessage("validation.transaction.checkLastPurchase.notLast.message")
          );
        }
      } else {
        throw new InvalidOperationException(
            MessageResolver.getInstance().getMessage("validation.transaction.checkLastPurchase.notPresent.error"),
            MessageResolver.getInstance().getMessage("validation.transaction.checkLastPurchase.notPresent.message")
        );
      }
    }
  }
}

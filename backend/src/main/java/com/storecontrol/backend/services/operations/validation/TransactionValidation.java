package com.storecontrol.backend.services.operations.validation;

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
      throw new InvalidOperationException("Create Transaction", "Insufficient cash to transaction");
    }
  }

  public void checkVoluntaryFunctionType(Voluntary voluntary) {
    if (voluntary.getVoluntaryRole().isNotAdmin()) {
      if ((voluntary.getFunction() == null)) {
        throw new InvalidOperationException("Create Transaction", "This voluntary has no role");
      } else {
        if (!(voluntary.getFunction() instanceof CashRegister)) {
          throw new InvalidOperationException("Create Transaction", "This voluntary can't do this operation");
        }
      }
    }
  }

  public void checkTransactionBelongsToVoluntary(Transaction transaction, UUID userUuid) {
    if (transaction.getVoluntary().getVoluntaryRole().isNotAdmin() && transaction.getVoluntary().getUuid() != userUuid) {
      throw new InvalidOperationException("Delete Transaction", "This transaction don't belongs to this voluntary");
    }
  }

  public void checkIfLastRechargeOfVoluntary(Transaction transaction, Voluntary voluntary) {
    if (voluntary.getVoluntaryRole().isNotAdmin()) {
      Optional<Transaction> optionalTransaction = repository.findLastFromVoluntary(voluntary.getUuid());

      if (optionalTransaction.isPresent()) {
        if (optionalTransaction.get().getUuid() != transaction.getUuid()) {
          throw new InvalidOperationException("Delete Transaction", "This transaction is not the last form this voluntary");
        }
      } else {
        throw new InvalidOperationException("Delete Transaction", "This voluntary don't have any transaction done");
      }
    }
  }
}

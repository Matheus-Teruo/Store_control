package com.storecontrol.backend.services.operations.validation;

import com.storecontrol.backend.infra.exceptions.InvalidOperationException;
import com.storecontrol.backend.models.enumerate.TransactionType;
import com.storecontrol.backend.models.registers.CashRegister;
import com.storecontrol.backend.models.volunteers.Voluntary;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class TransactionValidation {

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

  public void checkVoluntaryFunctionMatch(Voluntary voluntary) {
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
}

package com.storecontrol.backend.services.validation;

import com.storecontrol.backend.models.operations.request.RequestTransaction;
import com.storecontrol.backend.models.registers.CashRegister;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class TransactionValidate {

  public void checkCashAvailableToTransaction(RequestTransaction request , CashRegister cashRegister) {
    var cashTotal = cashRegister.getCashTotal();
    var cashTransaction = new BigDecimal(request.amount());

    if (cashTransaction.compareTo(cashTotal) > 0) {
      // TODO: error:
    }
  }
}

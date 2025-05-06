package com.storecontrol.backend.models.operations.transactions.response;

import com.storecontrol.backend.models.enumerate.TransactionType;
import com.storecontrol.backend.models.operations.transactions.Transaction;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseSummaryTransaction(
    UUID uuid,
    BigDecimal amount,
    TransactionType transactionTypeEnum,
    String transactionTimeStamp,
    UUID registerUuid,
    UUID voluntaryUuid
) {

  public ResponseSummaryTransaction(Transaction transaction) {
    this(transaction.getUuid(),
        transaction.getAmount(),
        transaction.getTransactionTypeEnum(),
        transaction.getTransactionTimeStamp().toString(),
        transaction.getRegister().getUuid(),
        transaction.getVoluntaryUuid()
    );
  }
}

package com.storecontrol.backend.models.operations.response;

import com.storecontrol.backend.models.enumerate.TransactionType;
import com.storecontrol.backend.models.operations.Transaction;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseSummaryTransaction(
    UUID uuid,
    BigDecimal amount,
    TransactionType transactionTypeEnum,
    String transactionTimeStamp,
    UUID summaryVoluntary
) {

  public ResponseSummaryTransaction(Transaction transaction) {
    this(transaction.getUuid(),
        transaction.getAmount(),
        transaction.getTransactionTypeEnum(),
        transaction.getTransactionTimeStamp().toString(),
        transaction.getVoluntaryUuid()
    );
  }
}

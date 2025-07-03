package com.storecontrol.backend.models.operations.transactions.response;

import com.storecontrol.backend.models.enumerate.TransactionType;
import com.storecontrol.backend.models.operations.transactions.Transaction;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseSummaryTransaction(
    UUID uuid,
    BigDecimal amount,
    TransactionType transactionTypeEnum,
    String transactionTimestamp,
    UUID registerUuid
) {

  public ResponseSummaryTransaction(Transaction transaction) {
    this(transaction.getUuid(),
        transaction.getAmount(),
        transaction.getTransactionTypeEnum(),
        transaction.getTransactionTimestamp().toString(),
        transaction.getRegisterUuid()
    );
  }
}

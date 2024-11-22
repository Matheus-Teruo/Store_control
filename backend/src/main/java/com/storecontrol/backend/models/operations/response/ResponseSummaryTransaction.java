package com.storecontrol.backend.models.operations.response;

import com.storecontrol.backend.models.volunteers.response.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.enumerate.TransactionType;
import com.storecontrol.backend.models.operations.Transaction;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseSummaryTransaction(
    UUID uuid,
    BigDecimal amount,
    Enum<TransactionType> transactionTypeEnum,
    String transactionTimeStamp,
    ResponseSummaryVoluntary voluntaryId
) {

  public ResponseSummaryTransaction(Transaction transaction) {
    this(transaction.getUuid(),
        transaction.getAmount(),
        transaction.getTransactionTypeEnum(),
        transaction.getTransactionTimeStamp().toString(),
        new ResponseSummaryVoluntary(transaction.getVoluntary()));
  }
}

package com.storecontrol.backend.models.operations.response;

import com.storecontrol.backend.models.registers.response.ResponseSummaryCashRegister;
import com.storecontrol.backend.models.volunteers.response.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.enumerate.TransactionType;
import com.storecontrol.backend.models.operations.Transaction;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseTransaction(
    UUID uuid,
    BigDecimal amount,
    TransactionType transactionTypeEnum,
    String transactionTimeStamp,
    ResponseSummaryCashRegister cashRegisterId,
    ResponseSummaryVoluntary voluntaryId
) {

  public ResponseTransaction(Transaction transaction) {
    this(transaction.getUuid(),
        transaction.getAmount(),
        transaction.getTransactionTypeEnum(),
        transaction.getTransactionTimeStamp().toString(),
        new ResponseSummaryCashRegister(transaction.getCashRegister()),
        new ResponseSummaryVoluntary(transaction.getVoluntary()));
  }
}

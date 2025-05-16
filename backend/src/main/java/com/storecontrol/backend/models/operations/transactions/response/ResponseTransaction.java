package com.storecontrol.backend.models.operations.transactions.response;

import com.storecontrol.backend.models.registers.response.ResponseSummaryRegister;
import com.storecontrol.backend.models.volunteers.response.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.enumerate.TransactionType;
import com.storecontrol.backend.models.operations.transactions.Transaction;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseTransaction(
    UUID uuid,
    BigDecimal amount,
    TransactionType transactionTypeEnum,
    String transactionTimeStamp,
    ResponseSummaryRegister summaryRegister,
    ResponseSummaryVoluntary summaryVoluntary
) {

  public ResponseTransaction(Transaction transaction) {
    this(transaction.getUuid(),
        transaction.getAmount(),
        transaction.getTransactionTypeEnum(),
        transaction.getTransactionTimeStamp().toString(),
        new ResponseSummaryRegister(transaction.getRegister()),
        new ResponseSummaryVoluntary(transaction.getVoluntary())
    );
  }
}

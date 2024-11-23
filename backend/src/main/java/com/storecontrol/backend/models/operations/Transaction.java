package com.storecontrol.backend.models.operations;

import com.storecontrol.backend.models.operations.request.RequestCreateTransaction;
import com.storecontrol.backend.models.registers.CashRegister;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.models.enumerate.TransactionType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transactions")
@Getter
@NoArgsConstructor
public class Transaction {

  @Id @GeneratedValue(generator = "UUID")
  private UUID uuid;

  @Column(nullable = false)
  private BigDecimal amount;

  @Column(name = "transaction_type", nullable = false)
  @Enumerated(EnumType.STRING)
  private TransactionType transactionTypeEnum;

  @Column(name = "transaction_time_stamp", nullable = false)
  private LocalDateTime transactionTimeStamp;

  @ManyToOne @JoinColumn(name = "cash_register_uuid", nullable = false)
  private CashRegister cashRegister;

  @ManyToOne @JoinColumn(name = "voluntary_uuid", nullable = false)
  private Voluntary voluntary;

  @Column(nullable = false)
  private boolean valid;


  public Transaction(RequestCreateTransaction request, CashRegister cashRegister, Voluntary voluntary) {
    this.amount = request.amount();
    this.transactionTypeEnum = TransactionType.fromString(request.transactionTypeEnum());
    this.transactionTimeStamp = LocalDateTime.now();
    this.cashRegister = cashRegister;
    this.voluntary = voluntary;
    this.valid = true;
  }

  public void deleteTransaction() {
    this.valid = false;
  }
}

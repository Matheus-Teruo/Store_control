package com.storecontrol.backend.models.operations.transactions;

import com.storecontrol.backend.models.operations.transactions.request.RequestCreateTransaction;
import com.storecontrol.backend.models.registers.Register;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.models.enumerate.TransactionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transactions")
@Getter
@NoArgsConstructor
@AllArgsConstructor
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

  @Column(name = "cash_register_uuid", insertable = false, updatable = false)
  private UUID registerUuid;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "cash_register_uuid", nullable = false)
  private Register register;

  @Column(name = "voluntary_uuid", insertable = false, updatable = false)
  private UUID voluntaryUuid;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "voluntary_uuid", nullable = false)
  private Voluntary voluntary;

  @Column(nullable = false)
  private boolean valid;


  public Transaction(RequestCreateTransaction request, Register register, Voluntary voluntary) {
    this.amount = request.amount();
    this.transactionTypeEnum = TransactionType.fromString(request.transactionTypeEnum());
    this.transactionTimeStamp = LocalDateTime.now();
    this.register = register;
    this.voluntary = voluntary;
    this.valid = true;
  }

  public void deleteTransaction() {
    this.valid = false;
  }
}

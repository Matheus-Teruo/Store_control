package com.storecontrol.backend.models.operations;

import com.storecontrol.backend.models.customers.request.RequestCustomerFinalization;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.registers.CashRegister;
import com.storecontrol.backend.models.volunteers.Voluntary;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "refunds")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Refund {

  @Id @GeneratedValue(generator = "UUID")
  private UUID uuid;

  @Column(name = "refund_value", nullable = false)
  private BigDecimal refundValue;

  @Column(name = "refund_time_stamp", nullable = false)
  private LocalDateTime refundTimeStamp;

  @ManyToOne @JoinColumn(name = "customer_uuid", nullable = false)
  private Customer customer;

  @ManyToOne @JoinColumn(name = "cash_register_uuid", nullable = false)
  private CashRegister cashRegister;

  @Column(name = "voluntary_uuid", insertable = false, updatable = false)
  private UUID voluntaryUuid;

  @ManyToOne @JoinColumn(name = "voluntary_uuid", nullable = false)
  private Voluntary voluntary;

  @Column(nullable = false)
  private boolean valid;


  public Refund(RequestCustomerFinalization request,
                Customer customer,
                CashRegister cashRegister,
                Voluntary voluntary) {
    this.refundValue = request.refundValue();
    this.refundTimeStamp = LocalDateTime.now();
    this.customer = customer;
    this.cashRegister = cashRegister;
    this.voluntary = voluntary;
    this.valid = true;
  }

  public void deleteRefund() {
    this.valid = false;
  }
}

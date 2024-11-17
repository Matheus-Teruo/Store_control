package com.storecontrol.backend.models;

import com.storecontrol.backend.controllers.request.customer.RequestAuxFinalizeCustomer;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "refunds")
@Getter
@NoArgsConstructor
public class Refund {
  @Id
  @GeneratedValue(generator = "UUID")
  private UUID uuid;
  @Column(name = "refund_value")
  private BigDecimal refundValue;
  @Column(name = "refund_time_stamp")
  private LocalDateTime refundTimeStamp;
  @OneToOne @JoinColumn(name = "customer_uuid")
  private Customer customer;
  @ManyToOne @JoinColumn(name = "voluntary_uuid")
  private Voluntary voluntary;
  private Boolean valid;

  public Refund(RequestAuxFinalizeCustomer request, Customer customer, Voluntary voluntary) {
    this.refundValue = new BigDecimal(request.refundValue());
    this.refundTimeStamp = LocalDateTime.now();
    this.customer = customer;
    this.voluntary = voluntary;
    this.valid = true;
  }

  public void deleteRefund() {
    this.valid = false;
  }
}

package com.storecontrol.backend.models.operations.finalization;

import com.storecontrol.backend.models.customers.request.RequestCustomerFinalization;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.registers.Register;
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

  @Column(name = "refund_timestamp", nullable = false)
  private LocalDateTime refundTimestamp;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "customer_uuid", nullable = false)
  private Customer customer;

  @Column(name = "register_uuid", insertable = false, updatable = false)
  private UUID registerUuid;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "register_uuid", nullable = false)
  private Register register;

  @Column(name = "voluntary_uuid", insertable = false, updatable = false)
  private UUID voluntaryUuid;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "voluntary_uuid", nullable = false)
  private Voluntary voluntary;

  @Column(nullable = false)
  private boolean valid;


  public Refund(RequestCustomerFinalization request,
                Customer customer,
                Register register,
                Voluntary voluntary) {
    this.refundValue = request.refundValue();
    this.refundTimestamp = LocalDateTime.now();
    this.customer = customer;
    this.register = register;
    this.voluntary = voluntary;
    this.valid = true;
  }

  public void deleteRefund() {
    this.valid = false;
  }
}

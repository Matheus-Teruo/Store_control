package com.storecontrol.backend.models.operations.trades;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "trades")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Trade {

  @Id
  @GeneratedValue(generator = "UUID")
  private UUID uuid;

  @Column(name = "recharge_uuid")
  private UUID rechargeUuid;

  @Column(name = "purchase_uuid")
  private UUID purchaseUuid;

  @Column(name = "trade_time_stamp", nullable = false)
  private LocalDateTime tradeTimeStamp;

  @Column(nullable = false)
  private boolean valid;

  public Trade(UUID rechargeUuid, UUID purchaseUuid) {
    this.rechargeUuid = rechargeUuid;
    this.purchaseUuid = purchaseUuid;
    this.tradeTimeStamp = LocalDateTime.now();
    this.valid = true;
  }

  public void deleteTrade() {
    this.valid = false;
  }
}

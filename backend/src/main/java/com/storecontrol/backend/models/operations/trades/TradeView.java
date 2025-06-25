package com.storecontrol.backend.models.operations.trades;

import com.storecontrol.backend.models.enumerate.PaymentType;
import com.storecontrol.backend.models.operations.recharges.Recharge;
import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Immutable
@Table(name = "trades_view")
@Getter
@NoArgsConstructor
public class TradeView {

  @Id
  private UUID uuid;

  @Column(name = "recharge_uuid")
  private UUID rechargeUuid;

  @Column(name = "purchase_uuid")
  private UUID purchaseUuid;

  @Column(name = "recharge_value")
  private BigDecimal rechargeValue;

  @Column(name = "payment_type")
  @Enumerated(EnumType.STRING)
  private PaymentType paymentTypeEnum;

  @Column(name = "register_uuid")
  private UUID registerUuid;

  @Column(name = "on_order")
  private boolean onOrder;

  private boolean reversal;

  @Column(name = "stand_uuid")
  private UUID standUuid;

  @Column(name = "voluntary_uuid")
  private UUID voluntaryUuid;

  @Column(name = "trade_timestamp")
  private LocalDateTime tradeTimestamp;

  @Transient
  @Setter
  private List<Item> items;

  @Column(nullable = false)
  private boolean valid;

  public TradeView(Trade trade, Recharge recharge, Purchase purchase) {
    this.uuid = trade.getUuid();
    this.rechargeUuid = recharge.getUuid();
    this.purchaseUuid = purchase.getUuid();
    this.rechargeValue = recharge.getRechargeValue();
    this.paymentTypeEnum = recharge.getPaymentTypeEnum();
    this.registerUuid = recharge.getRegisterUuid();
    this.onOrder = purchase.isOnOrder();
    this.reversal = purchase.isReversal();
    this.standUuid = purchase.getStandUuid();
    this.voluntaryUuid = purchase.getVoluntaryUuid();
    this.tradeTimestamp = trade.getTradeTimestamp();
    this.items = purchase.getItems();
    this.valid = trade.isValid();
  }
}

package com.storecontrol.backend.models.operations.trades;

import com.storecontrol.backend.models.enumerate.PaymentType;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
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

  @Column(name = "payment_type_enum")
  @Enumerated(EnumType.STRING)
  private PaymentType paymentTypeEnum;

  @Column(name = "on_order")
  private boolean onOrder;

  @Column(name = "stand_uuid")
  private UUID standUuid;

  @Column(name = "trade_time_stamp")
  private LocalDateTime tradeTimeStamp;

  @OneToMany(mappedBy = "tradeView", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Item> items;

  @Column(nullable = false)
  private boolean valid;

  public TradeView(Trade trade, Recharge recharge, Purchase purchase) {
    this.uuid = trade.getUuid();
    this.rechargeUuid = recharge.getUuid();
    this.purchaseUuid = purchase.getUuid();
    this.rechargeValue = recharge.getRechargeValue();
    this.paymentTypeEnum = recharge.getPaymentTypeEnum();
    this.onOrder = purchase.isOnOrder();
    this.standUuid = purchase.getStandUuid();
    this.tradeTimeStamp = trade.getTradeTimeStamp();
    this.items = purchase.getItems();
    this.valid = trade.isValid();
  }
}

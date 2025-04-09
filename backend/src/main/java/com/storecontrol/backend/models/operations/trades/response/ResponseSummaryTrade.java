package com.storecontrol.backend.models.operations.trades.response;

import com.storecontrol.backend.models.enumerate.PaymentType;
import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.operations.trades.TradeView;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseSummaryTrade(
    UUID uuid,
    UUID rechargeUuid,
    UUID purchaseUuid,
    BigDecimal rechargeValue,
    PaymentType paymentTypeEnum,
    Boolean onOrder,
    String tradeTimeStamp,
    Integer totalItems
) {

  public ResponseSummaryTrade(TradeView tradeView) {
    this(tradeView.getUuid(),
        tradeView.getRechargeUuid(),
        tradeView.getPurchaseUuid(),
        tradeView.getRechargeValue(),
        tradeView.getPaymentTypeEnum(),
        tradeView.isOnOrder(),
        tradeView.getTradeTimeStamp().toString(),
        tradeView.getItems().stream().map(Item::getQuantity)
            .reduce(0, Integer::sum)
    );
  }
}
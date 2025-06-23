package com.storecontrol.backend.models.operations.trades.response;

import com.storecontrol.backend.models.enumerate.PaymentType;
import com.storecontrol.backend.models.operations.purchases.response.ResponseItem;
import com.storecontrol.backend.models.operations.trades.TradeView;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.models.volunteers.response.ResponseSummaryVoluntary;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ResponseTrade(
    UUID uuid,
    UUID rechargeUuid,
    UUID purchaseUuid,
    BigDecimal rechargeValue,
    PaymentType paymentTypeEnum,
    Boolean onOrder,
    String tradeTimeStamp,
    List<ResponseItem> items,
    ResponseSummaryVoluntary summaryVoluntary
) {

  public ResponseTrade(TradeView trade, Voluntary voluntary) {
    this(trade.getUuid(),
        trade.getRechargeUuid(),
        trade.getPurchaseUuid(),
        trade.getRechargeValue(),
        trade.getPaymentTypeEnum(),
        trade.isOnOrder(),
        trade.getTradeTimeStamp().toString(),
        trade.getItems().stream().map(ResponseItem::new).toList(),
        new ResponseSummaryVoluntary(voluntary)
    );
  }
}

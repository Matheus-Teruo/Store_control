package com.storecontrol.backend.models.operations.response;

import com.storecontrol.backend.models.enumerate.PaymentType;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.purchases.response.ResponseItem;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ResponseTrade(
    UUID rechargeUuid,
    UUID purchaseUuid,
    BigDecimal rechargeValue,
    PaymentType paymentTypeEnum,
    Boolean onOrder,
    String tradeTimeStamp,
    List<ResponseItem> items
) {

  public ResponseTrade(Recharge recharge, Purchase purchase) {
    this(recharge.getUuid(),
        purchase.getUuid(),
        recharge.getRechargeValue(),
        recharge.getPaymentTypeEnum(),
        purchase.isOnOrder(),
        purchase.getPurchaseTimeStamp().toString(),
        purchase.getItems().stream().map(ResponseItem::new).toList()
    );
  }
}

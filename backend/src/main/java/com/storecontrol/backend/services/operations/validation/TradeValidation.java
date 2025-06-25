package com.storecontrol.backend.services.operations.validation;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidOperationException;
import com.storecontrol.backend.models.operations.recharges.Recharge;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.operations.recharges.request.RequestCreateRecharge;
import com.storecontrol.backend.models.operations.trades.Trade;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class TradeValidation {
  public void checkRechargeMatchTotalPrice(RequestCreateRecharge recharge, RequestCreatePurchase purchase) {
    var totalValue = purchase
        .items()
        .stream()
        .map(requestCreateItem ->
            BigDecimal.valueOf(requestCreateItem.quantity())
                .multiply(requestCreateItem.unitPrice().subtract(requestCreateItem.discount())))
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    if (totalValue.compareTo(recharge.rechargeValue()) != 0) {
      throw new InvalidOperationException(
          MessageResolver.getInstance().getMessage("validation.trade.checkTotal.notMatch.error"),
          MessageResolver.getInstance().getMessage("validation.trade.checkTotal.notMatch.message")
      );
    }
  }

  public void checkIfLastTrade(Recharge recharge, Purchase purchase, Trade trade) {
    if (!trade.getRechargeUuid().equals(recharge.getUuid())) {
      throw new InvalidOperationException(
          MessageResolver.getInstance().getMessage("validation.trade.checkRecharge.notLast.error"),
          MessageResolver.getInstance().getMessage("validation.trade.checkRecharge.notLast.message")
      );
    }
    if (!trade.getPurchaseUuid().equals(purchase.getUuid())) {
      throw new InvalidOperationException(
          MessageResolver.getInstance().getMessage("validation.trade.checkPurchase.notLast.error"),
          MessageResolver.getInstance().getMessage("validation.trade.checkPurchase.notLast.message")
      );
    }
  }
}

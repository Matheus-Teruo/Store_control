package com.storecontrol.backend.services.operations.validation;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidOperationException;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.operations.request.RequestCreateRecharge;
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

    if (totalValue.compareTo(recharge.rechargeValue()) > 0) {
      throw new InvalidOperationException(
          MessageResolver.getInstance().getMessage("validation.purchase.checkDebit.insufficientDebit.error"),
          MessageResolver.getInstance().getMessage("validation.purchase.checkDebit.insufficientDebit.message")
      );
    }
  }
}

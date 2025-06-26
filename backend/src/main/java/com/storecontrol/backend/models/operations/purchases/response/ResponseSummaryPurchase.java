package com.storecontrol.backend.models.operations.purchases.response;

import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.operations.purchases.Purchase;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ResponseSummaryPurchase(
    UUID uuid,
    Boolean onOrder,
    Boolean reversal,
    String purchaseTimestamp,
    Integer totalItems,
    BigDecimal totalPurchaseCost,
    BigDecimal totalPurchaseDiscount,
    BigDecimal finalTotalPurchase,
    UUID voluntaryUuid
) {

  public ResponseSummaryPurchase(Purchase purchase) {
    this(
        purchase.getUuid(),
        purchase.isOnOrder(),
        purchase.isReversal(),
        purchase.getPurchaseTimestamp().toString(),
        purchase.getItems().stream().map(Item::getQuantity)
            .reduce(0, Integer::sum),
        purchase.getItems().stream()
            .map(item -> BigDecimal.valueOf(item.getQuantity())
                .multiply(item.getUnitPrice()))
            .reduce(BigDecimal.ZERO, BigDecimal::add),
        purchase.getItems().stream()
            .map(item -> BigDecimal.valueOf(item.getQuantity())
                .multiply(item.getDiscount()))
            .reduce(BigDecimal.ZERO, BigDecimal::add),
        purchase.getItems().stream()
            .map(item -> BigDecimal.valueOf(item.getQuantity())
                .multiply(item.getUnitPrice().subtract(item.getDiscount())))
            .reduce(BigDecimal.ZERO, BigDecimal::add),
        purchase.getVoluntaryUuid()
    );
  }

  public ResponseSummaryPurchase(Purchase purchase, List<Item> items) {
    this(
        purchase.getUuid(),
        purchase.isOnOrder(),
        purchase.isReversal(),
        purchase.getPurchaseTimestamp().toString(),
        sumQuantity(items),
        calcTotal(items),
        calcDiscount(items),
        calcFinal(items),
        purchase.getVoluntaryUuid()
    );
  }

  private static Integer sumQuantity(List<Item> items) {
    return items == null ? 0 : items.stream().map(Item::getQuantity).reduce(0, Integer::sum);
  }

  private static BigDecimal calcTotal(List<Item> items) {
    return items == null ? BigDecimal.ZERO :
        items.stream()
            .map(i -> BigDecimal.valueOf(i.getQuantity()).multiply(i.getUnitPrice()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
  }

  private static BigDecimal calcDiscount(List<Item> items) {
    return items == null ? BigDecimal.ZERO :
        items.stream()
            .map(i -> BigDecimal.valueOf(i.getQuantity()).multiply(i.getDiscount()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
  }

  private static BigDecimal calcFinal(List<Item> items) {
    return items == null ? BigDecimal.ZERO :
        items.stream()
            .map(i -> BigDecimal.valueOf(i.getQuantity())
                .multiply(i.getUnitPrice().subtract(i.getDiscount())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
  }
}

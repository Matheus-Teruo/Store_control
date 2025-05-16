package com.storecontrol.backend.models.statistics.stands;

import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.stands.products.Product;
import com.storecontrol.backend.models.statistics.stands.response.ResponseProductChart;
import com.storecontrol.backend.models.statistics.stands.response.ResponseStandChart;
import com.storecontrol.backend.models.statistics.stands.response.ResponseStandTotal;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Getter
public class StandGroup {
  private final UUID standUuid;
  private final String standName;
  private final Map<UUID, ProductGroup> productGroups = new HashMap<>();
  private int totalQuantity = 0;
  private BigDecimal totalAmount = BigDecimal.ZERO;

  public StandGroup(UUID standUuid, String standName) {
    this.standUuid = standUuid;
    this.standName = standName;
  }

  public void addItem(Item item, Product product, LocalDateTime timestamp) {
    if (!item.isValid()) return;

    int quantity = item.getQuantity();
    BigDecimal value = item.getUnitPrice()
        .multiply(BigDecimal.valueOf(quantity))
        .subtract(item.getDiscount());

    totalQuantity += quantity;
    totalAmount = totalAmount.add(value);

    productGroups
        .computeIfAbsent(product.getUuid(), id -> new ProductGroup(product))
        .addItem(item, timestamp);
  }

  public void addItemWithoutProduct(Item item) {
    if (!item.isValid()) return;

    int quantity = item.getQuantity();
    BigDecimal value = item.getUnitPrice()
        .multiply(BigDecimal.valueOf(quantity))
        .subtract(item.getDiscount());

    totalQuantity += quantity;
    totalAmount = totalAmount.add(value);
  }

  public ResponseStandTotal toStandTotal() {
    return new ResponseStandTotal(standUuid, standName, totalQuantity, totalAmount);
  }

  public ResponseStandChart toStandChart() {
    List<ResponseProductChart> productCharts = productGroups.values().stream()
        .map(ProductGroup::toProductChart)
        .toList();

    return new ResponseStandChart(standUuid, standName, productCharts);
  }
}
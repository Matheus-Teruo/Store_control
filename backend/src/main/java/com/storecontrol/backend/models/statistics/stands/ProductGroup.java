package com.storecontrol.backend.models.statistics.stands;

import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.stands.products.Product;
import com.storecontrol.backend.models.statistics.stands.response.ResponseProductChart;
import com.storecontrol.backend.models.statistics.stands.response.ResponseProductTotal;
import com.storecontrol.backend.models.statistics.stands.response.ResponsePurchaseChartNode;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

public class ProductGroup {
  private final UUID productUuid;
  private final String productName;
  private int totalQuantity;
  private BigDecimal totalAmount = BigDecimal.ZERO;
  private final Map<LocalDateTime, PurchaseNode> timeGroupedData = new TreeMap<>();

  public ProductGroup(Product product) {
    this.productUuid = product.getUuid();
    this.productName = product.getProductName();
  }

  public void addItem(Item item, LocalDateTime timestamp) {
    if (!item.isValid()) return;

    int quantity = item.getQuantity();
    BigDecimal value = item.getUnitPrice()
        .multiply(BigDecimal.valueOf(quantity))
        .subtract(item.getDiscount());

    totalQuantity += quantity;
    totalAmount = totalAmount.add(value);

    if (timestamp != null) {
      LocalDateTime truncated = truncateTo5Minutes(timestamp);
      timeGroupedData
          .computeIfAbsent(truncated, t -> new PurchaseNode(truncated))
          .add(quantity, value);
    }
  }

  private LocalDateTime truncateTo5Minutes(LocalDateTime dateTime){
    return dateTime.truncatedTo(ChronoUnit.MINUTES)
        .withMinute((dateTime.getMinute() / 5) * 5);
  }

  public ResponseProductTotal toProductTotal() {
    return new ResponseProductTotal(productUuid, productName, totalQuantity, totalAmount);
  }

  public ResponseProductChart toProductChart() {
    List<ResponsePurchaseChartNode> nodes = timeGroupedData.entrySet().stream()
        .map(entry -> new ResponsePurchaseChartNode(
            entry.getKey(),
            entry.getValue().getQuantity(),
            entry.getValue().getTotal()
        ))
        .toList(); // já está ordenado por LocalDateTime (graças ao TreeMap)

    return new ResponseProductChart(productUuid, productName, nodes);
  }
}

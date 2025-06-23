package com.storecontrol.backend.models.statistics.stands;

import com.storecontrol.backend.models.statistics.stands.response.ResponsePurchaseChartNode;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
public class PurchaseNode {
  private final LocalDateTime time;
  private int quantity = 0;
  private BigDecimal total = BigDecimal.ZERO;

  public PurchaseNode(LocalDateTime time) {
    this.time = time;
  }

  public void add(int q, BigDecimal t) {
    quantity += q;
    total = total.add(t);
  }

  public ResponsePurchaseChartNode toChartNodes() {
    return  new ResponsePurchaseChartNode(time, quantity, total);
  }
}

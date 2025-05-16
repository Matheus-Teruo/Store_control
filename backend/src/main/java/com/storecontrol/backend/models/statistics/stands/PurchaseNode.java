package com.storecontrol.backend.models.statistics.stands;

import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
public class PurchaseNode {
  private LocalDateTime time;
  private int quantity = 0;
  private BigDecimal total = BigDecimal.ZERO;

  public PurchaseNode(LocalDateTime truncated) {
  }

  public void add(int q, BigDecimal t) {
    quantity += q;
    total = total.add(t);
  }
}

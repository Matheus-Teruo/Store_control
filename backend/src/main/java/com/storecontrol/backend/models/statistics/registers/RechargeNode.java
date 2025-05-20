package com.storecontrol.backend.models.statistics.registers;

import com.storecontrol.backend.models.enumerate.PaymentType;
import com.storecontrol.backend.models.statistics.registers.response.ResponseRechargeChartNode;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

public class RechargeNode {
  private final LocalDateTime time;
  private final Map<PaymentType, BigDecimal> totals = new EnumMap<>(PaymentType.class);

  public RechargeNode(LocalDateTime time) {
    this.time = time;
  }

  public void add(PaymentType type, BigDecimal value) {
    totals.merge(type, value, BigDecimal::add);
  }

  public List<ResponseRechargeChartNode> toChartNodes() {
    return totals.entrySet().stream()
        .map(e -> new ResponseRechargeChartNode(time, e.getKey(), e.getValue()))
        .toList();
  }
}

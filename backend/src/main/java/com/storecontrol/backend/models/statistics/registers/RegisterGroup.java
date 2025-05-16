package com.storecontrol.backend.models.statistics.registers;

import com.storecontrol.backend.models.enumerate.PaymentType;
import com.storecontrol.backend.models.statistics.registers.response.ResponseRechargeChartNode;
import com.storecontrol.backend.models.statistics.registers.response.ResponseRegisterChart;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;

public class RegisterGroup {
  private final UUID registerUuid;
  private final String registerName;
  private final Map<LocalDateTime, RechargeGroup> groupedRecharges = new TreeMap<>();

  public RegisterGroup(UUID uuid, String name) {
    this.registerUuid = uuid;
    this.registerName = name;
  }

  public void addRecharge(LocalDateTime timestamp, PaymentType type, BigDecimal value) {
    LocalDateTime truncated = truncateTo5Minutes(timestamp);
    RechargeGroup group = groupedRecharges.computeIfAbsent(truncated, RechargeGroup::new);
    group.add(type, value);
  }

  public ResponseRegisterChart toChartDto() {
    List<ResponseRechargeChartNode> nodes = groupedRecharges.values().stream()
        .flatMap(g -> g.toChartNodes().stream())
        .toList();

    return new ResponseRegisterChart(registerUuid, registerName, nodes);
  }

  private LocalDateTime truncateTo5Minutes(LocalDateTime dateTime) {
    return dateTime.truncatedTo(ChronoUnit.MINUTES)
        .withMinute((dateTime.getMinute() / 5) * 5);
  }
}

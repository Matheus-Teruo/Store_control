package com.storecontrol.backend.models.statistics.registers;

import com.storecontrol.backend.models.enumerate.PaymentType;
import com.storecontrol.backend.models.statistics.registers.response.ResponseRechargeChartNode;
import com.storecontrol.backend.models.statistics.registers.response.ResponseRegisterChart;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;

@Getter
public class RegisterGroup {
  private final UUID registerUuid;
  private final String registerName;
  private final Map<LocalDateTime, RechargeNode> groupedRecharges = new TreeMap<>();

  public RegisterGroup(UUID uuid, String name) {
    this.registerUuid = uuid;
    this.registerName = name;
  }

  public void addRecharge(LocalDateTime timestamp, PaymentType type, BigDecimal value) {
    RechargeNode group = groupedRecharges.computeIfAbsent(timestamp, RechargeNode::new);
    group.add(type, value);
  }

  public ResponseRegisterChart toRegisterChart() {
    List<ResponseRechargeChartNode> nodes = groupedRecharges.values().stream()
        .flatMap(g -> g.toChartNodes().stream())
        .toList();

    return new ResponseRegisterChart(registerUuid, registerName, nodes);
  }
}

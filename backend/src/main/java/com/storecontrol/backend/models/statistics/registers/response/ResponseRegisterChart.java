package com.storecontrol.backend.models.statistics.registers.response;

import java.util.List;
import java.util.UUID;

public record ResponseRegisterChart(
    UUID registerUuid,
    String registerName,
    List<ResponseRechargeChartNode> rechargeCharts
) {
}

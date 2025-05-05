package com.storecontrol.backend.models.charts.response;

import java.util.List;
import java.util.UUID;

public record ResponseCashRegisterChart(
    UUID cashRegisterUuid,
    String cashRegisterName,
    List<ResponseRechargeChartNode> rechargeCharts
) {
}

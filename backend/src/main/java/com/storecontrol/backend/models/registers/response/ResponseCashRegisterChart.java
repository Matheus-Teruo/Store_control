package com.storecontrol.backend.models.registers.response;

import com.storecontrol.backend.models.operations.response.ResponseRechargeChartNode;

import java.util.List;
import java.util.UUID;

public record ResponseCashRegisterChart(
    UUID cashRegisterUuid,
    String cashRegisterName,
    List<ResponseRechargeChartNode> rechargeCharts
) {
}

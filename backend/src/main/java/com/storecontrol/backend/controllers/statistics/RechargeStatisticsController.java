package com.storecontrol.backend.controllers.statistics;

import com.storecontrol.backend.models.statistics.registers.response.ResponsePaymentTypeTotal;
import com.storecontrol.backend.models.statistics.registers.response.ResponseRegisterChart;
import com.storecontrol.backend.services.statistics.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("statistics/registers")
public class RechargeStatisticsController {

  @Autowired
  private StatisticsService service;

  @GetMapping("/payment-type")
  public ResponseEntity<List<ResponsePaymentTypeTotal>> readPaymentTypeTotals() {
    List<ResponsePaymentTypeTotal> charts = service.getPaymentTypeTotals();
    return ResponseEntity.ok(charts);
  }

  @GetMapping("/recharges")
  public ResponseEntity<List<ResponseRegisterChart>> readRechargeCharts() {
    List<ResponseRegisterChart> charts = service.getRechargeCharts();
    return ResponseEntity.ok(charts);
  }
}

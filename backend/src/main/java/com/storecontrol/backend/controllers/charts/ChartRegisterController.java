package com.storecontrol.backend.controllers.charts;

import com.storecontrol.backend.models.charts.response.ResponsePaymentTypeChart;
import com.storecontrol.backend.models.charts.response.ResponseRegisterChart;
import com.storecontrol.backend.services.charts.ChartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("charts/registers")
public class ChartRegisterController {

  @Autowired
  private ChartService service;

  @GetMapping("/payment-type")
  public ResponseEntity<List<ResponsePaymentTypeChart>> readPaymentTypeTotalCharts() {
    List<ResponsePaymentTypeChart> charts = service.getPaymentTypeTotalCharts();
    return ResponseEntity.ok(charts);
  }

  @GetMapping("/recharges")
  public ResponseEntity<List<ResponseRegisterChart>> readRechargeCharts() {
    List<ResponseRegisterChart> charts = service.getRechargeCharts();
    return ResponseEntity.ok(charts);
  }
}

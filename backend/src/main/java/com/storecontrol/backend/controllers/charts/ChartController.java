package com.storecontrol.backend.controllers.charts;

import com.storecontrol.backend.models.registers.response.ResponseCashRegisterChart;
import com.storecontrol.backend.models.stands.response.ResponseStandChart;
import com.storecontrol.backend.services.charts.ChartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("charts")
public class ChartController {

  @Autowired
  private ChartService service;

  @GetMapping("/registers/recharges")
  public ResponseEntity<List<ResponseCashRegisterChart>> readRechargeCharts() {
    List<ResponseCashRegisterChart> charts = service.getRechargeCharts();
    return ResponseEntity.ok(charts);
  }

  @GetMapping("/stands/purchases")
  public ResponseEntity<List<ResponseStandChart>> readPurchaseCharts(@RequestParam(required = false) UUID standUuid) {
    List<ResponseStandChart> charts = service.getPurchaseCharts(standUuid);
    return ResponseEntity.ok(charts);
  }
}

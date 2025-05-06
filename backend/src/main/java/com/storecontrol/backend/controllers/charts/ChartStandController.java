package com.storecontrol.backend.controllers.charts;

import com.storecontrol.backend.models.charts.response.ResponseStandChart;
import com.storecontrol.backend.models.charts.response.ResponseStandProductTotalChart;
import com.storecontrol.backend.models.charts.response.ResponseStandTotalChart;
import com.storecontrol.backend.services.charts.ChartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("charts/stands")
public class ChartStandController {

  @Autowired
  private ChartService service;

  @GetMapping()
  public ResponseEntity<List<ResponseStandTotalChart>> readStandCharts(@RequestParam(required = false) UUID standUuid) {
    List<ResponseStandTotalChart> charts = service.getStandsCharts(standUuid);
    return ResponseEntity.ok(charts);
  }

  @GetMapping("/products")
  public ResponseEntity<List<ResponseStandProductTotalChart>> readProductsCharts(@RequestParam(required = false) UUID standUuid) {
    List<ResponseStandProductTotalChart> charts = service.getProductsCharts(standUuid);
    return ResponseEntity.ok(charts);
  }

  @GetMapping("/purchases")
  public ResponseEntity<List<ResponseStandChart>> readPurchaseCharts(@RequestParam(required = false) UUID standUuid) {
    List<ResponseStandChart> charts = service.getPurchaseCharts(standUuid);
    return ResponseEntity.ok(charts);
  }
}

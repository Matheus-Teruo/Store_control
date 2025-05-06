package com.storecontrol.backend.controllers.statistics;

import com.storecontrol.backend.models.statistics.stands.response.ResponseStandChart;
import com.storecontrol.backend.models.statistics.stands.response.ResponseStandProductTotal;
import com.storecontrol.backend.models.statistics.stands.response.ResponseStandTotal;
import com.storecontrol.backend.services.statistics.StatisticsService;
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
public class StandStatisticsController {

  @Autowired
  private StatisticsService service;

  @GetMapping()
  public ResponseEntity<List<ResponseStandTotal>> readStandCharts(@RequestParam(required = false) UUID standUuid) {
    List<ResponseStandTotal> charts = service.getStandsCharts(standUuid);
    return ResponseEntity.ok(charts);
  }

  @GetMapping("/products")
  public ResponseEntity<List<ResponseStandProductTotal>> readProductsCharts(@RequestParam(required = false) UUID standUuid) {
    List<ResponseStandProductTotal> charts = service.getProductsCharts(standUuid);
    return ResponseEntity.ok(charts);
  }

  @GetMapping("/purchases")
  public ResponseEntity<List<ResponseStandChart>> readPurchaseCharts(@RequestParam(required = false) UUID standUuid) {
    List<ResponseStandChart> charts = service.getPurchaseCharts(standUuid);
    return ResponseEntity.ok(charts);
  }
}

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

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("statistics/stands")
public class StandStatisticsController {

  @Autowired
  private StatisticsService service;

  @GetMapping()
  public ResponseEntity<List<ResponseStandTotal>> readStandTotals(
      @RequestParam(required = false) UUID standUuid,
      @RequestParam LocalDateTime startTime,
      @RequestParam LocalDateTime endTime
  ) {
    List<ResponseStandTotal> charts = service.getStandTotals(standUuid, startTime, endTime);
    return ResponseEntity.ok(charts);
  }

  @GetMapping("/products")
  public ResponseEntity<List<ResponseStandProductTotal>> readProductTotals(
      @RequestParam(required = false) UUID standUuid,
      @RequestParam LocalDateTime startTime,
      @RequestParam LocalDateTime endTime
  ) {
    List<ResponseStandProductTotal> charts = service.getProductTotals(standUuid, startTime, endTime);
    return ResponseEntity.ok(charts);
  }

  @GetMapping("/purchases")
  public ResponseEntity<List<ResponseStandChart>> readPurchaseCharts(
      @RequestParam(required = false) UUID standUuid,
      @RequestParam LocalDateTime startTime,
      @RequestParam LocalDateTime endTime
  ) {
    List<ResponseStandChart> charts = service.getPurchaseCharts(standUuid, startTime, endTime);
    return ResponseEntity.ok(charts);
  }
}

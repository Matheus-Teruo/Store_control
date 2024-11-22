package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.models.operations.response.ResponseRefund;
import com.storecontrol.backend.models.operations.response.ResponseSummaryRefund;
import com.storecontrol.backend.services.operations.RefundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("refunds")
public class RefundController {

  @Autowired
  RefundService service;

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseRefund> readRefund(@PathVariable String uuid) {
    var response = new ResponseRefund(service.takeRefundByUuid(uuid));

    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseSummaryRefund>> readRefunds() {
    var donation = service.listRefunds();

    var response = donation.stream().map(ResponseSummaryRefund::new).toList();
    return ResponseEntity.ok(response);
  }
}

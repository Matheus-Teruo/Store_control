package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.models.operations.response.ResponseRefund;
import com.storecontrol.backend.models.operations.response.ResponseSummaryRefund;
import com.storecontrol.backend.services.operations.RefundService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("refunds")
public class RefundController {

  @Autowired
  RefundService service;

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseRefund> readRefund(@PathVariable @Valid UUID uuid) {
    var response = new ResponseRefund(service.takeRefundByUuid(uuid));

    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<Page<ResponseSummaryRefund>> readRefunds(Pageable pageable) {
    var donation = service.pageRefunds(pageable);

    var response = donation.map(ResponseSummaryRefund::new);
    return ResponseEntity.ok(response);
  }
}

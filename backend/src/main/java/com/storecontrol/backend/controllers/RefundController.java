package com.storecontrol.backend.controllers;

import com.storecontrol.backend.controllers.request.refund.RequestRefund;
import com.storecontrol.backend.controllers.response.refund.ResponseRefund;
import com.storecontrol.backend.services.RefundService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("refunds")
public class RefundController {

  @Autowired
  RefundService service;

  @PostMapping
  public ResponseEntity<ResponseRefund> createRefund(@RequestBody @Valid RequestRefund request) {
    var response = service.createRefund(request);

    return ResponseEntity.ok(response);
  }
}

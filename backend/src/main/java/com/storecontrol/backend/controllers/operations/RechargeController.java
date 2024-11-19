package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.controllers.operations.request.RequestRecharge;
import com.storecontrol.backend.controllers.operations.request.RequestUpdateRecharge;
import com.storecontrol.backend.controllers.operations.response.ResponseRecharge;
import com.storecontrol.backend.controllers.operations.response.ResponseSummaryRecharge;
import com.storecontrol.backend.services.operations.RechargeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("recharges")
public class RechargeController {

  @Autowired
  RechargeService service;

  @PostMapping
  public ResponseEntity<ResponseRecharge> createRecharge(@RequestBody @Valid RequestRecharge request) {
    var response = new ResponseRecharge(service.createRecharge(request));

    return ResponseEntity.ok(response);
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseRecharge> readRecharge(@PathVariable String uuid) {
    var response = new ResponseRecharge(service.takeRechargeByUuid(uuid));

    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseSummaryRecharge>> readRecharges() {
    var recharges = service.listRecharges();

    var response = recharges.stream().map(ResponseSummaryRecharge::new).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponseRecharge> updateRecharge(@RequestBody @Valid RequestUpdateRecharge request) {
    var response = new ResponseRecharge(service.updateRecharge(request));

    return ResponseEntity.ok(response);
  }

  @DeleteMapping
  public ResponseEntity<Void> deleteRecharge(@RequestBody @Valid RequestUpdateRecharge request) {
    service.deleteRecharge(request);

    return ResponseEntity.noContent().build();
  }
}

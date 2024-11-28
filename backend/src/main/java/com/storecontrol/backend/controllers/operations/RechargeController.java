package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.models.operations.request.RequestCreateRecharge;
import com.storecontrol.backend.models.operations.request.RequestDeleteRecharge;
import com.storecontrol.backend.models.operations.response.ResponseRecharge;
import com.storecontrol.backend.models.operations.response.ResponseSummaryRecharge;
import com.storecontrol.backend.services.operations.RechargeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("recharges")
public class RechargeController {

  @Autowired
  RechargeService service;

  @PostMapping
  public ResponseEntity<ResponseRecharge> createRecharge(@RequestBody @Valid RequestCreateRecharge request) {
    var recharge = service.createRecharge(request);

    URI location = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .path("/{uuid}")
        .buildAndExpand(recharge.getUuid())
        .toUri();

    return ResponseEntity.created(location).body(new ResponseRecharge(recharge));
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseRecharge> readRecharge(@PathVariable UUID uuid) {
    var response = new ResponseRecharge(service.takeRechargeByUuid(uuid));

    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseSummaryRecharge>> readRecharges() {
    var recharges = service.listRecharges();

    var response = recharges.stream().map(ResponseSummaryRecharge::new).toList();
    return ResponseEntity.ok(response);
  }

  @DeleteMapping
  public ResponseEntity<Void> deleteRecharge(@RequestBody @Valid RequestDeleteRecharge request) {
    service.deleteRecharge(request);

    return ResponseEntity.noContent().build();
  }
}

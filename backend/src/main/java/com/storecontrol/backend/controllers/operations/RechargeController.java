package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.models.operations.request.RequestCreateRecharge;
import com.storecontrol.backend.models.operations.response.ResponseRecharge;
import com.storecontrol.backend.models.operations.response.ResponseSummaryRecharge;
import com.storecontrol.backend.services.operations.RechargeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
  public ResponseEntity<ResponseRecharge> createRecharge(
      @RequestBody @Valid RequestCreateRecharge request,
      @RequestAttribute("UserUuid") UUID userUuid
  ) {
    var recharge = service.createRecharge(request, userUuid);

    URI location = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .path("/{uuid}")
        .buildAndExpand(recharge.getUuid())
        .toUri();

    return ResponseEntity.created(location).body(new ResponseRecharge(recharge));
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseRecharge> readRecharge(@PathVariable @Valid UUID uuid) {
    var response = new ResponseRecharge(service.takeRechargeByUuid(uuid));

    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<Page<ResponseSummaryRecharge>> readRecharges(Pageable pageable) {
    var recharges = service.pageRecharges(pageable);

    var response = recharges.map(ResponseSummaryRecharge::new);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/last3")
  public ResponseEntity<List<ResponseSummaryRecharge>> readLast3Purchases(@RequestAttribute("UserUuid") UUID userUuid) {
    var recharges = service.listLast3Purchases(userUuid);

    var response = recharges.stream().map(ResponseSummaryRecharge::new).toList();
    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{uuid}")
  public ResponseEntity<Void> deleteRecharge(
      @PathVariable @Valid UUID uuid,
      @RequestAttribute("UserUuid") UUID userUuid
  ) {
    service.deleteRecharge(uuid, userUuid);

    return ResponseEntity.noContent().build();
  }
}

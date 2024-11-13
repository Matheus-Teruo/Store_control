package com.storecontrol.backend.controllers;

import com.storecontrol.backend.controllers.request.stand.RequestStand;
import com.storecontrol.backend.controllers.request.stand.RequestUpdateStand;
import com.storecontrol.backend.controllers.response.stand.ResponseStand;
import com.storecontrol.backend.controllers.response.stand.ResponseSummaryStand;
import com.storecontrol.backend.services.StandService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("stands")
public class StandController {

  @Autowired
  StandService service;

  @PostMapping
  public ResponseEntity<ResponseStand> createStand(@RequestBody @Valid RequestStand request) {
    var response = new ResponseStand(service.createStand(request));

    return ResponseEntity.ok(response);
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseStand> readStand(@PathVariable String uuid) {
    var stand = service.takeStandByUuid(uuid);

    var response = new ResponseStand(stand);
    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseSummaryStand>> readStands() {
    var stands = service.listStands();

    var response = stands.stream().map(ResponseSummaryStand::new).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponseStand> updateStand(@RequestBody @Valid RequestUpdateStand request) {
    var response = new ResponseStand(service.updateStand(request));

    return ResponseEntity.ok(response);
  }

  @DeleteMapping
  public ResponseEntity<Void> deleteStand(@RequestBody @Valid RequestUpdateStand request) {
    service.deleteStand(request);

    return ResponseEntity.noContent().build();
  }
}
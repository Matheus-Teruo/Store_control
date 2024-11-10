package com.storecontrol.backend.controllers;

import com.storecontrol.backend.controllers.request.stand.RequestStand;
import com.storecontrol.backend.controllers.request.stand.RequestUpdateStand;
import com.storecontrol.backend.controllers.response.stand.ResponseStand;
import com.storecontrol.backend.controllers.response.stand.ResponseSummaryStand;
import com.storecontrol.backend.models.Stand;
import com.storecontrol.backend.repositories.StandRepository;
import com.storecontrol.backend.services.StandService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("stands")
public class StandController {

  @Autowired
  StandService service;

  @Autowired
  StandRepository repository;

  @PostMapping
  public ResponseEntity<ResponseStand> createStand(@RequestBody @Valid RequestStand request) {
    var stand = new Stand(request);
    repository.save(stand);

    var response = new ResponseStand(stand);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{id}")
  public ResponseEntity<ResponseStand> readStand(@PathVariable UUID id) {
    var stand = repository.findByIdValidTrue(id);

    var response = new ResponseStand(stand);
    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseSummaryStand>> readStands() {
    var stands = repository.findAllByValidTrue();

    var response = stands.stream().map(ResponseSummaryStand::new).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponseStand> updateStand(@RequestBody @Valid RequestUpdateStand request) {
    var response = service.serviceUptadeStand(request);

    return ResponseEntity.ok(response);
  }

  @DeleteMapping
  public ResponseEntity<Void> deleteStand(@RequestBody @Valid RequestUpdateStand request) {
    service.serviceDeleteStand(request);

    return ResponseEntity.noContent().build();
  }
}
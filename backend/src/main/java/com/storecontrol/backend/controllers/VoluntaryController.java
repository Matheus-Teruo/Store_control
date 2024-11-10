package com.storecontrol.backend.controllers;

import com.storecontrol.backend.controllers.request.voluntary.RequestUpdateVoluntary;
import com.storecontrol.backend.controllers.request.voluntary.RequestVoluntary;
import com.storecontrol.backend.controllers.response.voluntary.ResponseSummaryVoluntary;
import com.storecontrol.backend.controllers.response.voluntary.ResponseVoluntary;
import com.storecontrol.backend.models.Voluntary;
import com.storecontrol.backend.repositories.VoluntaryRepository;
import com.storecontrol.backend.services.VoluntaryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("volunteers")
public class VoluntaryController {

  @Autowired
  VoluntaryService service;

  @Autowired
  VoluntaryRepository repository;

  @PostMapping
  public ResponseEntity<ResponseVoluntary> createVoluntary(@RequestBody @Valid RequestVoluntary request) {
    var voluntary = new Voluntary(request);
    repository.save(voluntary);

    var response = new ResponseVoluntary(voluntary);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{id}")
  public ResponseEntity<ResponseVoluntary> readVoluntary(@PathVariable UUID id) {
    var voluntary = repository.findByIdValidTrue(id);

    var response = new ResponseVoluntary(voluntary);
    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseSummaryVoluntary>> readVolunteers() {
    var volunteers = repository.findAllByValidTrue();

    var response = volunteers.stream().map(ResponseSummaryVoluntary::new).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponseVoluntary> updateVoluntary(@RequestBody @Valid RequestUpdateVoluntary request) {
    var response = service.serviceUptadeVoluntary(request);

    return ResponseEntity.ok(response);
  }

  @DeleteMapping
  public ResponseEntity<Void> deleteVoluntary(@RequestBody @Valid RequestUpdateVoluntary request) {
    service.serviceDeleteVoluntary(request);

    return ResponseEntity.noContent().build();
  }
}

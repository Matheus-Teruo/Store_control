package com.storecontrol.backend.controllers;

import com.storecontrol.backend.controllers.request.voluntary.RequestCreateVoluntary;
import com.storecontrol.backend.controllers.request.voluntary.RequestUpdateVoluntary;
import com.storecontrol.backend.controllers.response.voluntary.ResponseSummaryVoluntary;
import com.storecontrol.backend.controllers.response.voluntary.ResponseVoluntary;
import com.storecontrol.backend.services.VoluntaryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("volunteers")
public class VoluntaryController {

  @Autowired
  VoluntaryService service;

  @PostMapping
  public ResponseEntity<ResponseVoluntary> createVoluntary(@RequestBody @Valid RequestCreateVoluntary request) {
    var response = new ResponseVoluntary(service.createVoluntary(request));

    return ResponseEntity.ok(response);
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseVoluntary> readVoluntary(@PathVariable String uuid) {
    var response = new ResponseVoluntary(service.takeVoluntary(uuid));

    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseSummaryVoluntary>> readVolunteers() {
    var volunteers = service.listVolunteers();

    var response = volunteers.stream().map(ResponseSummaryVoluntary::new).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponseVoluntary> updateVoluntary(@RequestBody @Valid RequestUpdateVoluntary request) {
    var response = new ResponseVoluntary(service.uptadeVoluntary(request));

    return ResponseEntity.ok(response);
  }

  @DeleteMapping
  public ResponseEntity<Void> deleteVoluntary(@RequestBody @Valid RequestUpdateVoluntary request) {
    service.deleteVoluntary(request);

    return ResponseEntity.noContent().build();
  }
}

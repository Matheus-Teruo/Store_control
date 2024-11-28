package com.storecontrol.backend.controllers.volunteers;

import com.storecontrol.backend.models.volunteers.request.RequestCreateVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestUpdateVoluntary;
import com.storecontrol.backend.models.volunteers.response.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.volunteers.response.ResponseVoluntary;
import com.storecontrol.backend.services.volunteers.VoluntaryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("volunteers")
public class VoluntaryController {

  @Autowired
  VoluntaryService service;

  @PostMapping
  public ResponseEntity<ResponseVoluntary> createVoluntary(@RequestBody @Valid RequestCreateVoluntary request) {
    var voluntary = service.createVoluntary(request);

    URI location = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .path("/{uuid}")
        .buildAndExpand(voluntary.getUuid())
        .toUri();

    return ResponseEntity.created(location).body(new ResponseVoluntary(voluntary));
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseVoluntary> readVoluntary(@PathVariable UUID uuid) {
    var response = new ResponseVoluntary(service.takeVoluntaryByUuid(uuid));

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

package com.storecontrol.backend.controllers.volunteers;

import com.storecontrol.backend.models.volunteers.request.RequestRoleVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestUpdateVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestUpdateVoluntaryFunction;
import com.storecontrol.backend.models.volunteers.response.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.volunteers.response.ResponseVoluntary;
import com.storecontrol.backend.services.volunteers.VoluntaryService;
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
    var response = new ResponseVoluntary(service.updateVoluntary(request));

    return ResponseEntity.ok(response);
  }

  @PutMapping("/function")
  public ResponseEntity<ResponseVoluntary> updateFunctionFromVoluntary(
      @RequestBody @Valid RequestUpdateVoluntaryFunction request) {
    var response = new ResponseVoluntary(service.updateFunctionFromVoluntary(request));

    return ResponseEntity.ok(response);
  }

  @PutMapping("/superuser")
  public ResponseEntity<ResponseVoluntary> updateVoluntaryRole(@RequestBody @Valid RequestRoleVoluntary request) {
    var response = new ResponseVoluntary(service.updateVoluntaryRole(request));

    return ResponseEntity.ok(response);
  }

  @DeleteMapping
  public ResponseEntity<Void> deleteVoluntary(@RequestBody @Valid RequestUpdateVoluntary request) {
    service.deleteVoluntary(request);

    return ResponseEntity.noContent().build();
  }
}

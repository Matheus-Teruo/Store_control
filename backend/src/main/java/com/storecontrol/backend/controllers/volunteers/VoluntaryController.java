package com.storecontrol.backend.controllers.volunteers;

import com.storecontrol.backend.models.volunteers.request.RequestPasswordVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestUpdateVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestUpdateVoluntaryFunction;
import com.storecontrol.backend.models.volunteers.request.RequestVoluntaryRole;
import com.storecontrol.backend.models.volunteers.response.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.volunteers.response.ResponseVoluntary;
import com.storecontrol.backend.services.volunteers.VoluntaryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("volunteers")
public class VoluntaryController {

  @Autowired
  private VoluntaryService service;

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseVoluntary> readVoluntary(
      @PathVariable @Valid UUID uuid) {
    var response = new ResponseVoluntary(service.takeVoluntaryByUuid(uuid));

    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<Page<ResponseSummaryVoluntary>> readVolunteers(
      Pageable pageable
  ) {
    var volunteers = service.pageVolunteers(pageable);

    var response = volunteers.map(ResponseSummaryVoluntary::new);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/list")
  public ResponseEntity<List<ResponseSummaryVoluntary>> readListAssociations() {
    var volunteers = service.listVolunteers();

    var response = volunteers.stream().map(ResponseSummaryVoluntary::new).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponseVoluntary> updateVoluntary(
      @RequestBody @Valid RequestUpdateVoluntary request) {
    var response = new ResponseVoluntary(service.updateVoluntary(request));

    return ResponseEntity.ok(response);
  }

  @PutMapping("/function")
  public ResponseEntity<ResponseVoluntary> updateFunctionFromVoluntary(
      @RequestBody @Valid RequestUpdateVoluntaryFunction request) {
    var response = new ResponseVoluntary(service.updateFunctionFromVoluntary(request));

    return ResponseEntity.ok(response);
  }

  @PutMapping("/role")
  public ResponseEntity<ResponseVoluntary> updateVoluntaryRole(@RequestBody @Valid RequestVoluntaryRole request) {
    var response = new ResponseVoluntary(service.updateVoluntaryRole(request));

    return ResponseEntity.ok(response);
  }

  @PutMapping("/forgot-password")
  public ResponseEntity<ResponseVoluntary> updatePassword(@RequestBody @Valid RequestPasswordVoluntary request) {
    var response = new ResponseVoluntary(service.updatePassword(request));

    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{uuid}")
  public ResponseEntity<Void> deleteVoluntary(@PathVariable @Valid UUID uuid) {
    service.deleteVoluntary(uuid);

    return ResponseEntity.noContent().build();
  }
}

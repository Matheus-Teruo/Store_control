package com.storecontrol.backend.controllers.stands;

import com.storecontrol.backend.models.stands.request.RequestCreateStand;
import com.storecontrol.backend.models.stands.request.RequestUpdateStand;
import com.storecontrol.backend.models.stands.response.ResponseStand;
import com.storecontrol.backend.models.stands.response.ResponseSummaryStand;
import com.storecontrol.backend.services.stands.StandService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("stands")
public class StandController {

  @Autowired
  StandService service;

  @PostMapping
  public ResponseEntity<ResponseStand> createStand(@RequestBody @Valid RequestCreateStand request) {
    var stand = service.createStand(request);

    URI location = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .path("/{uuid}")
        .buildAndExpand(stand.getUuid())
        .toUri();

    return ResponseEntity.created(location).body(new ResponseStand(stand));
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseStand> readStand(@PathVariable UUID uuid) {
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
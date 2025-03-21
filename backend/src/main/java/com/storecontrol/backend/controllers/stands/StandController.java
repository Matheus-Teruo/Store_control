package com.storecontrol.backend.controllers.stands;

import com.storecontrol.backend.models.stands.request.RequestCreateStand;
import com.storecontrol.backend.models.stands.request.RequestUpdateStand;
import com.storecontrol.backend.models.stands.response.ResponseStand;
import com.storecontrol.backend.models.stands.response.ResponseSummaryStand;
import com.storecontrol.backend.services.stands.StandService;
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
  public ResponseEntity<ResponseStand> readStand(@PathVariable @Valid UUID uuid) {
    var stand = service.takeStandByUuid(uuid);

    var response = new ResponseStand(stand);
    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<Page<ResponseSummaryStand>> readStands(Pageable pageable) {
    var stands = service.pageStands(pageable);

    var response = stands.map(ResponseSummaryStand::new);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/list")
  public ResponseEntity<List<ResponseSummaryStand>> readListStands() {
    var stands = service.listStands();

    var response = stands.stream().map(ResponseSummaryStand::new).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponseStand> updateStand(@RequestBody @Valid RequestUpdateStand request) {
    var response = new ResponseStand(service.updateStand(request));

    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{uuid}")
  public ResponseEntity<Void> deleteStand(@PathVariable @Valid UUID uuid) {
    service.deleteStand(uuid);

    return ResponseEntity.noContent().build();
  }
}
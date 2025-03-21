package com.storecontrol.backend.controllers.stands;

import com.storecontrol.backend.models.stands.request.RequestCreateAssociation;
import com.storecontrol.backend.models.stands.request.RequestUpdateAssociation;
import com.storecontrol.backend.models.stands.response.ResponseAssociation;
import com.storecontrol.backend.models.stands.response.ResponseSummaryAssociation;
import com.storecontrol.backend.services.stands.AssociationService;
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
@RequestMapping("associations")
public class AssociationController {

  @Autowired
  AssociationService service;

  @PostMapping
  public ResponseEntity<ResponseAssociation> createAssociation(@RequestBody @Valid RequestCreateAssociation request) {
    var association = service.createAssociation(request);

    URI location = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .path("/{uuid}")
        .buildAndExpand(association.getUuid())
        .toUri();

    return ResponseEntity.created(location).body(new ResponseAssociation(association));
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseAssociation> readAssociation(@PathVariable @Valid UUID uuid) {
    var response = new ResponseAssociation(service.takeAssociationByUuid(uuid));

    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<Page<ResponseSummaryAssociation>> readAssociations(Pageable pageable) {
    var associations = service.pageAssociations(pageable);

    var response = associations.map(ResponseSummaryAssociation::new);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/list")
  public ResponseEntity<List<ResponseSummaryAssociation>> readListAssociations() {
    var associations = service.listAssociations();

    var response = associations.stream().map(ResponseSummaryAssociation::new).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponseAssociation> updateAssociation(@RequestBody @Valid RequestUpdateAssociation request) {
    var response = new ResponseAssociation(service.updateAssociation(request));

    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{uuid}")
  public ResponseEntity<Void> deleteAssociation(@PathVariable @Valid UUID uuid) {
    service.deleteAssociation(uuid);

    return ResponseEntity.noContent().build();
  }
}

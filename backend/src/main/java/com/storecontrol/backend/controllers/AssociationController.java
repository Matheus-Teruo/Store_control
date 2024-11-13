package com.storecontrol.backend.controllers;

import com.storecontrol.backend.controllers.request.association.RequestAssociation;
import com.storecontrol.backend.controllers.request.association.RequestUpdateAssociation;
import com.storecontrol.backend.controllers.response.association.ResponseAssociation;
import com.storecontrol.backend.controllers.response.association.ResponseSummaryAssociation;
import com.storecontrol.backend.services.AssociationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("associations")
public class AssociationController {

  @Autowired
  AssociationService service;

  @PostMapping
  public ResponseEntity<ResponseAssociation> createAssociation(@RequestBody @Valid RequestAssociation request) {
    var response = new ResponseAssociation(service.createAssociation(request));

    return ResponseEntity.ok(response);
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseAssociation> readAssociation(@PathVariable String uuid) {
    var response = new ResponseAssociation(service.takeAssociationByUuid(uuid));

    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseSummaryAssociation>> readAssociations() {
    var associations = service.listAssociations();

    var response = associations.stream().map(ResponseSummaryAssociation::new).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponseAssociation> updateAssociation(@RequestBody @Valid RequestUpdateAssociation request) {
    var response = new ResponseAssociation(service.updateAssociation(request));

    return ResponseEntity.ok(response);
  }

  @DeleteMapping
  public ResponseEntity<Void> deleteAssociation(@RequestBody @Valid RequestUpdateAssociation request) {
    service.deleteAssociation(request);

    return ResponseEntity.noContent().build();
  }
}

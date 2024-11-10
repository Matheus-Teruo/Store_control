package com.storecontrol.backend.controllers;

import com.storecontrol.backend.controllers.request.association.RequestAssociation;
import com.storecontrol.backend.controllers.request.association.RequestUpdateAssociation;
import com.storecontrol.backend.controllers.response.association.ResponseAssociation;
import com.storecontrol.backend.controllers.response.association.ResponseSummaryAssociation;
import com.storecontrol.backend.models.Association;
import com.storecontrol.backend.repositories.AssociationRepository;
import com.storecontrol.backend.services.AssociationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("associations")
public class AssociationController {

  @Autowired
  AssociationService service;

  @Autowired
  AssociationRepository repository;

  @PostMapping @Transactional
  public ResponseEntity<ResponseAssociation> createAssociation(@RequestBody @Valid RequestAssociation request) {
    var association = new Association(request);
    repository.save(association);

    var response = new ResponseAssociation(association);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{id}")
  public ResponseEntity<ResponseAssociation> readAssociation(@PathVariable UUID id) {
    var association = repository.findByIdValidTrue(id);

    var response = new ResponseAssociation(association);
    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseSummaryAssociation>> readAssociations() {
    var associations = repository.findAllByValidTrue();

    var response = associations.stream().map(ResponseSummaryAssociation::new).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponseAssociation> updateAssociation(@RequestBody @Valid RequestUpdateAssociation request) {
    var response = service.serviceUptadeAssociation(request);

    return ResponseEntity.ok(response);
  }

  @DeleteMapping
  public ResponseEntity<Void> deleteAssociation(@RequestBody @Valid RequestUpdateAssociation request) {
    service.serviceDeleteAssociation(request);

    return ResponseEntity.noContent().build();
  }
}

package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.models.operations.response.ResponseDonation;
import com.storecontrol.backend.models.operations.response.ResponseSummaryDonation;
import com.storecontrol.backend.services.operations.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("donations")
public class DonationController {

  @Autowired
  DonationService service;

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseDonation> readDonation(@PathVariable UUID uuid) {
    var response = new ResponseDonation(service.takeDonationByUuid(uuid));

    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseSummaryDonation>> readDonations() {
    var donation = service.listDonations();

    var response = donation.stream().map(ResponseSummaryDonation::new).toList();
    return ResponseEntity.ok(response);
  }
}

package com.storecontrol.backend.controllers;

import com.storecontrol.backend.controllers.request.donation.RequestDonation;
import com.storecontrol.backend.controllers.request.donation.RequestDeleteDonation;
import com.storecontrol.backend.controllers.response.donation.ResponseDonation;
import com.storecontrol.backend.controllers.response.donation.ResponseSummaryDonation;
import com.storecontrol.backend.services.DonationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("donations")
public class DonationController {

  @Autowired
  DonationService service;

  @PostMapping
  public ResponseEntity<ResponseDonation> createDonation(@RequestBody @Valid RequestDonation request) {
    var response = new ResponseDonation(service.createDonation(request));

    return ResponseEntity.ok(response);
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseDonation> readDonation(@PathVariable String uuid) {
    var response = new ResponseDonation(service.takeDonationByUuid(uuid));

    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseSummaryDonation>> readDonations() {
    var donation = service.listDonations();

    var response = donation.stream().map(ResponseSummaryDonation::new).toList();
    return ResponseEntity.ok(response);
  }

  @DeleteMapping
  public ResponseEntity<Void> deleteDonation(@RequestBody @Valid RequestDeleteDonation request) {
    service.deleteDonation(request);

    return ResponseEntity.noContent().build();
  }
}

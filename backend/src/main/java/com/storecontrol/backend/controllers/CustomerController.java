package com.storecontrol.backend.controllers;

import com.storecontrol.backend.controllers.response.association.ResponseSummaryAssociation;
import com.storecontrol.backend.controllers.response.customer.ResponseCustomer;
import com.storecontrol.backend.controllers.response.customer.ResponseSummaryCustomer;
import com.storecontrol.backend.repositories.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("customers")
public class CustomerController {

  @Autowired
  CustomerRepository repository;

  @GetMapping("/{id}")
  public ResponseEntity<ResponseCustomer> readCustomer(@PathVariable UUID id) {
    var customer = repository.findById(id);

    if (customer.isPresent()){
      var response = new ResponseCustomer(customer.get());
      return ResponseEntity.ok(response);
    } else {
      return ResponseEntity.badRequest().build();
    }
  }

  @GetMapping
  public ResponseEntity<List<ResponseSummaryCustomer>> readCustomersActive() {
    var customers = repository.findAllByValidTrue();

    var response = customers.stream().map(ResponseSummaryCustomer::new).toList();
    return ResponseEntity.ok(response);
  }
}

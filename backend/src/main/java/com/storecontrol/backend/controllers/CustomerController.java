package com.storecontrol.backend.controllers;

import com.storecontrol.backend.controllers.response.customer.ResponseCustomer;
import com.storecontrol.backend.controllers.response.customer.ResponseSummaryCustomer;
import com.storecontrol.backend.services.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("customers")
public class CustomerController {


  @Autowired
  CustomerService service;

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseCustomer> readCustomer(@PathVariable String uuid) {
    var response = new ResponseCustomer(service.takeAnyCustomer(uuid));

    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseSummaryCustomer>> readCustomersActive() {
    var customers = service.listCustomers();

    var response = customers.stream().map(ResponseSummaryCustomer::new).toList();
    return ResponseEntity.ok(response);
  }
}

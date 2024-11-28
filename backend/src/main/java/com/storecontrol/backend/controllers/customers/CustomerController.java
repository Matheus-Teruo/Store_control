package com.storecontrol.backend.controllers.customers;

import com.storecontrol.backend.models.customers.request.RequestCustomerFinalization;
import com.storecontrol.backend.models.customers.request.RequestOrderCard;
import com.storecontrol.backend.models.customers.response.ResponseCustomer;
import com.storecontrol.backend.models.customers.response.ResponseSummaryCustomer;
import com.storecontrol.backend.services.customers.CustomerFinalizationHandler;
import com.storecontrol.backend.services.customers.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("customers")
public class CustomerController {

  @Autowired
  CustomerService service;

  @Autowired
  CustomerFinalizationHandler customerSupport;

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseCustomer> readCustomer(@PathVariable UUID uuid) {
    var customer = service.takeFilteredCustomerByUuid(uuid);

    URI location = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .path("/{uuid}")
        .buildAndExpand(customer.getUuid())
        .toUri();

    return ResponseEntity.created(location).body(new ResponseCustomer(customer));
  }

  @GetMapping("/active")
  public ResponseEntity<List<ResponseSummaryCustomer>> readActiveCustomers() {
    var customers = service.listActiveCustomers();

    var response = customers.stream().map(ResponseSummaryCustomer::new).toList();
    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseSummaryCustomer>> readCustomers() {
    var customers = service.listCustomers();

    var response = customers.stream().map(ResponseSummaryCustomer::new).toList();
    return ResponseEntity.ok(response);
  }

  @PostMapping("/finalize")
  public ResponseEntity<ResponseCustomer> finalizeCustomer(@RequestBody @Valid RequestCustomerFinalization request) {
    var response = new ResponseCustomer(customerSupport.finalizeCustomer(request));

    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/finalize")
  public ResponseEntity<ResponseCustomer> undoFinalizeCustomer(@RequestBody @Valid RequestOrderCard request) {
    var response = new ResponseCustomer(customerSupport.undoFinalizeCustomer(request));

    return ResponseEntity.ok(response);
  }
}

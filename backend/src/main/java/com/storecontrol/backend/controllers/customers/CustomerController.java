package com.storecontrol.backend.controllers.customers;

import com.storecontrol.backend.models.customers.request.RequestAuxFinalizeCustomer;
import com.storecontrol.backend.models.customers.request.RequestCustomer;
import com.storecontrol.backend.models.customers.response.ResponseCustomer;
import com.storecontrol.backend.models.customers.response.ResponseSummaryCustomer;
import com.storecontrol.backend.services.customers.CustomerService;
import com.storecontrol.backend.services.customers.FinalizeCustomerSupport;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("customers")
public class CustomerController {

  @Autowired
  CustomerService service;

  @Autowired
  FinalizeCustomerSupport customerSupport;

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseCustomer> readCustomer(@PathVariable String uuid) {
    var response = new ResponseCustomer(service.takeFilteredCustomerByUuid(uuid));

    return ResponseEntity.ok(response);
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
  public ResponseEntity<ResponseCustomer> finalizeCustomer(@RequestBody @Valid RequestAuxFinalizeCustomer request) {
    var response = new ResponseCustomer(customerSupport.finalizeCustomer(request));

    return ResponseEntity.ok(response);
  }

  @PostMapping("/undofinalize")
  public ResponseEntity<ResponseCustomer> undoFinalizeCustomer(@RequestBody @Valid RequestCustomer request) {
    var response = new ResponseCustomer(customerSupport.undoFinalizeCustomer(request));

    return ResponseEntity.ok(response);
  }
}

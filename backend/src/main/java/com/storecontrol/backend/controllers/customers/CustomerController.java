package com.storecontrol.backend.controllers.customers;

import com.storecontrol.backend.models.customers.request.RequestCustomerFinalization;
import com.storecontrol.backend.models.customers.request.RequestOrderCard;
import com.storecontrol.backend.models.customers.response.ResponseCustomer;
import com.storecontrol.backend.models.customers.response.ResponseCustomerOrder;
import com.storecontrol.backend.models.customers.response.ResponseSummaryCustomer;
import com.storecontrol.backend.services.customers.CustomerFinalizationHandler;
import com.storecontrol.backend.services.customers.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("customers")
public class CustomerController {

  @Autowired
  CustomerService service;

  @Autowired
  CustomerFinalizationHandler customerFinalizationHandler;

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseCustomer> readCustomer(@PathVariable UUID uuid) {
    var response = new ResponseCustomer(service.takeFilteredCustomerByUuid(uuid));

    return ResponseEntity.ok(response);
  }

  @GetMapping("/card/{cardId}")
  public ResponseEntity<ResponseCustomerOrder> readCustomerByCard(@PathVariable @Valid RequestOrderCard cardId) {
    var response = new ResponseCustomerOrder(service.takeActiveCustomerByCardId(cardId.cardId()));

    return ResponseEntity.ok(response);
  }

  @GetMapping("/active")
  public ResponseEntity<Page<ResponseSummaryCustomer>> readActiveCustomers(Pageable pageable) {
    var customers = service.pageActiveCustomers(pageable);

    var response = customers.map(ResponseSummaryCustomer::new);
    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<Page<ResponseSummaryCustomer>> readCustomers(Pageable pageable) {
    var customers = service.pageCustomers(pageable);

    var response = customers.map(ResponseSummaryCustomer::new);
    return ResponseEntity.ok(response);
  }

  @PostMapping("/finalize")
  public ResponseEntity<ResponseCustomer> finalizeCustomer(
      @RequestBody @Valid RequestCustomerFinalization request,
      @RequestAttribute("UserUuid") UUID userUuid
  ) {
    var response = new ResponseCustomer(customerFinalizationHandler.finalizeCustomer(request, userUuid));

    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/finalize/{cardId}")
  public ResponseEntity<ResponseCustomer> undoFinalizeCustomer(
      @PathVariable @Valid RequestOrderCard cardId,
      @RequestAttribute("UserUuid") UUID userUuid
  ) {
    var response = new ResponseCustomer(customerFinalizationHandler.undoFinalizeCustomer(cardId, userUuid));

    return ResponseEntity.ok(response);
  }
}

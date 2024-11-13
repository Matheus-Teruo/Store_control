package com.storecontrol.backend.controllers;

import com.storecontrol.backend.controllers.request.sale.RequestSale;
import com.storecontrol.backend.controllers.request.sale.RequestUpdateSale;
import com.storecontrol.backend.controllers.response.sale.ResponseSale;
import com.storecontrol.backend.controllers.response.sale.ResponseSummarySale;
import com.storecontrol.backend.services.SaleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("sales")
public class SaleController {

  @Autowired
  SaleService service;

  @PostMapping
  public ResponseEntity<ResponseSale> createSale(@RequestBody @Valid RequestSale request) {
    var response = new ResponseSale(service.createSale(request));

    return ResponseEntity.ok(response);
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseSale> readSale(@PathVariable String uuid) {
    var response = new ResponseSale(service.takeSaleByUuid(uuid));

    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseSummarySale>> readSales() {
    var Sales = service.listSales();

    var response = Sales.stream().map(ResponseSummarySale::new).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponseSale> updateSale(@RequestBody @Valid RequestUpdateSale request) {
    var response = new ResponseSale(service.updateSale(request));

    return ResponseEntity.ok(response);
  }

  @DeleteMapping
  public ResponseEntity<Void> deleteSale(@RequestBody @Valid RequestUpdateSale request) {
    service.deleteSale(request);

    return ResponseEntity.noContent().build();
  }
}

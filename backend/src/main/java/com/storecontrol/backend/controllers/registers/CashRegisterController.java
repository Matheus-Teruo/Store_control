package com.storecontrol.backend.controllers.registers;

import com.storecontrol.backend.models.registers.request.RequestCreateCashRegister;
import com.storecontrol.backend.models.registers.request.RequestUpdateCashRegister;
import com.storecontrol.backend.models.registers.response.ResponseCashRegister;
import com.storecontrol.backend.models.registers.response.ResponseSummaryCashRegister;
import com.storecontrol.backend.services.registers.CashRegisterService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/registers")
public class CashRegisterController {

  @Autowired
  CashRegisterService service;

  @PostMapping
  public ResponseEntity<ResponseCashRegister> createCashRegister(@RequestBody @Valid RequestCreateCashRegister request) {
    var cashRegister = service.createCashRegister(request);

    URI location = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .path("/{uuid}")
        .buildAndExpand(cashRegister.getUuid())
        .toUri();

    return ResponseEntity.created(location).body(new ResponseCashRegister(cashRegister));
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseCashRegister> readCashRegister(@PathVariable @Valid UUID uuid) {
    var stand = service.takeCashRegisterByUuid(uuid);

    var response = new ResponseCashRegister(stand);
    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<Page<ResponseSummaryCashRegister>> readCashRegisters(Pageable pageable) {
    var stands = service.pageCashRegisters(pageable);

    var response = stands.map(ResponseSummaryCashRegister::new);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/list")
  public ResponseEntity<List<ResponseSummaryCashRegister>> readCashRegisters() {
    var stands = service.listCashRegisters();

    var response = stands.stream().map(ResponseSummaryCashRegister::new).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponseCashRegister> updateCashRegister(@RequestBody @Valid RequestUpdateCashRegister request) {
    var response = new ResponseCashRegister(service.updateCashRegister(request));

    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{uuid}")
  public ResponseEntity<Void> deleteCashRegister(@PathVariable @Valid UUID uuid) {
    service.deleteCashRegister(uuid);

    return ResponseEntity.noContent().build();
  }
}

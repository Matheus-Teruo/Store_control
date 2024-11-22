package com.storecontrol.backend.controllers.registers;

import com.storecontrol.backend.models.registers.request.RequestCashRegister;
import com.storecontrol.backend.models.registers.request.RequestUpdateCashRegister;
import com.storecontrol.backend.models.registers.response.ResponseCashRegister;
import com.storecontrol.backend.models.registers.response.ResponseSummaryCashRegister;
import com.storecontrol.backend.services.registers.CashRegisterService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/registers")
public class CashRegisterController {

  @Autowired
  CashRegisterService service;

  @PostMapping
  public ResponseEntity<ResponseCashRegister> createCashRegister(@RequestBody @Valid RequestCashRegister request) {
    var response = new ResponseCashRegister(service.createCashRegister(request));

    return ResponseEntity.ok(response);
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseCashRegister> readCashRegister(@PathVariable String uuid) {
    var stand = service.takeCashRegisterByUuid(uuid);

    var response = new ResponseCashRegister(stand);
    return ResponseEntity.ok(response);
  }

  @GetMapping
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

  @DeleteMapping
  public ResponseEntity<Void> deleteCashRegister(@RequestBody @Valid RequestUpdateCashRegister request) {
    service.deleteCashRegister(request);

    return ResponseEntity.noContent().build();
  }
}

package com.storecontrol.backend.controllers.registers;

import com.storecontrol.backend.models.registers.request.RequestCreateRegister;
import com.storecontrol.backend.models.registers.request.RequestUpdateRegister;
import com.storecontrol.backend.models.registers.response.ResponseRegister;
import com.storecontrol.backend.models.registers.response.ResponseSummaryRegister;
import com.storecontrol.backend.services.registers.RegisterService;
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
public class RegisterController {

  @Autowired
  private RegisterService service;

  @PostMapping
  public ResponseEntity<ResponseRegister> createRegister(@RequestBody @Valid RequestCreateRegister request) {
    var register = service.createRegister(request);

    URI location = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .path("/{uuid}")
        .buildAndExpand(register.getUuid())
        .toUri();

    return ResponseEntity.created(location).body(new ResponseRegister(register));
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseRegister> readRegister(@PathVariable @Valid UUID uuid) {
    var register = service.takeRegisterByUuid(uuid);

    var response = new ResponseRegister(register);
    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<Page<ResponseSummaryRegister>> readRegisters(Pageable pageable) {
    var registers = service.pageRegisters(pageable);

    var response = registers.map(ResponseSummaryRegister::new);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/list")
  public ResponseEntity<List<ResponseSummaryRegister>> readRegisters() {
    var registers = service.listRegisters();

    var response = registers.stream().map(ResponseSummaryRegister::new).toList();
    return ResponseEntity.ok(response);
  }

  @GetMapping("/list-all")
  public ResponseEntity<List<ResponseSummaryRegister>> readAllRegisters() {
    var registers = service.listAllRegisters();

    var response = registers.stream().map(ResponseSummaryRegister::new).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponseRegister> updateRegister(@RequestBody @Valid RequestUpdateRegister request) {
    var response = new ResponseRegister(service.updateRegister(request));

    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{uuid}")
  public ResponseEntity<Void> deleteRegister(@PathVariable @Valid UUID uuid) {
    service.deleteRegister(uuid);

    return ResponseEntity.noContent().build();
  }
}

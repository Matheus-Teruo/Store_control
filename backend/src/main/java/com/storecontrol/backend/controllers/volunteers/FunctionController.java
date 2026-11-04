package com.storecontrol.backend.controllers.volunteers;

import com.storecontrol.backend.models.volunteers.response.ResponseSummaryFunction;
import com.storecontrol.backend.services.volunteers.FunctionService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("functions")
@RequiredArgsConstructor
public class FunctionController {

  private final FunctionService service;

  @GetMapping
  public ResponseEntity<List<ResponseSummaryFunction>> readVolunteers() {
    var functions = service.listFunctions();

    var response = functions.stream().map(ResponseSummaryFunction::new).toList();
    return ResponseEntity.ok(response);
  }
}

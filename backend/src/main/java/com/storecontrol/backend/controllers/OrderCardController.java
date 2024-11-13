package com.storecontrol.backend.controllers;

import com.storecontrol.backend.controllers.request.orderCard.RequestOrderCard;
import com.storecontrol.backend.controllers.response.orderCard.ResponseOrderCard;
import com.storecontrol.backend.controllers.response.orderCard.ResponseSummaryOrderCard;
import com.storecontrol.backend.services.OrderCardService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("cards")
public class OrderCardController {

  @Autowired
  OrderCardService service;

  @PostMapping
  public ResponseEntity<ResponseOrderCard> createCard(@RequestBody @Valid RequestOrderCard request) {
    var response = new ResponseOrderCard(service.createOrderCard(request));
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{id}")
  public ResponseEntity<ResponseOrderCard> readCard(@PathVariable String id) {
    var response = new ResponseOrderCard(service.takeOrderCardById(id));

    return ResponseEntity.ok(response);
  }

  @GetMapping()
  public ResponseEntity<List<ResponseOrderCard>> readAllCards() {
    var cards = service.listAllOrderCards();

    var response = cards.stream().map(ResponseOrderCard::new).toList();
    return ResponseEntity.ok(response);
  }

  @GetMapping("/active")
  public ResponseEntity<List<ResponseSummaryOrderCard>> readActiveCards() {
    var cards = service.listActiveOrderCards();

    var response = cards.stream().map(ResponseSummaryOrderCard::new).toList();
    return ResponseEntity.ok(response);
  }
}

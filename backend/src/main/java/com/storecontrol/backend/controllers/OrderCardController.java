package com.storecontrol.backend.controllers;

import com.storecontrol.backend.controllers.request.orderCard.RequestCard;
import com.storecontrol.backend.controllers.request.orderCard.RequestUpdateCard;
import com.storecontrol.backend.controllers.response.orderCard.ResponseCard;
import com.storecontrol.backend.models.OrderCard;
import com.storecontrol.backend.repositories.OrderCardRepository;
import com.storecontrol.backend.services.OrderCardService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("cards")
public class OrderCardController {

  @Autowired
  OrderCardService service;

  @Autowired
  OrderCardRepository repository;

  @PostMapping
  public ResponseEntity<ResponseCard> createCard(@RequestBody @Valid RequestCard request) {
    var card = new OrderCard(request);
    repository.save(card);

    var response = new ResponseCard(card);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{id}")
  public ResponseEntity<ResponseCard> readCard(@PathVariable UUID id) {
    var card = repository.findByIdActiveTrue(id);

    var response = new ResponseCard(card);
    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseCard>> readCards() {
    var cards = repository.findAllByActiveTrue();

    var response = cards.stream().map(ResponseCard::new).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponseCard> updateCard(@RequestBody @Valid RequestUpdateCard request) {
    var response = service.serviceUptadeCard(request);

    return ResponseEntity.ok(response);
  }
}

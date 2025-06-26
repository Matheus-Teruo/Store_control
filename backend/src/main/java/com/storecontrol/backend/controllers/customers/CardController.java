package com.storecontrol.backend.controllers.customers;

import com.storecontrol.backend.models.customers.request.RequestCard;
import com.storecontrol.backend.models.customers.response.ResponseCard;
import com.storecontrol.backend.models.customers.response.ResponseSummaryCard;
import com.storecontrol.backend.services.customers.CardService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("cards")
public class CardController {

  @Autowired
  private CardService service;

  @PostMapping
  public ResponseEntity<ResponseCard> createCard(@RequestBody @Valid RequestCard request) {
    var card = service.createCard(request);

    URI location = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .path("/{cardId}")
        .buildAndExpand(card.getId())
        .toUri();

    return ResponseEntity.created(location).body(new ResponseCard(card));
  }

  @GetMapping("/{cardId}")
  public ResponseEntity<ResponseCard> readCard(@PathVariable @Valid RequestCard cardId) {
    var response = new ResponseCard(service.takeCardById(cardId.cardId()));

    return ResponseEntity.ok(response);
  }

  @GetMapping()
  public ResponseEntity<Page<ResponseCard>> readAllCards(Pageable pageable) {
    var cards = service.pageAllCards(pageable);

    var response = cards.map(ResponseCard::new);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/active")
  public ResponseEntity<Page<ResponseSummaryCard>> readActiveCards(Pageable pageable) {
    var cards = service.pageActiveCards(pageable);

    var response = cards.map(ResponseSummaryCard::new);
    return ResponseEntity.ok(response);
  }
}

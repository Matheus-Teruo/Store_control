package com.storecontrol.backend.controllers.customers;

import com.storecontrol.backend.models.customers.request.RequestOrderCard;
import com.storecontrol.backend.models.customers.response.ResponseOrderCard;
import com.storecontrol.backend.models.customers.response.ResponseSummaryOrderCard;
import com.storecontrol.backend.services.customers.OrderCardService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("cards")
public class OrderCardController {

  @Autowired
  OrderCardService service;

  @PostMapping
  public ResponseEntity<ResponseOrderCard> createCard(@RequestBody @Valid RequestOrderCard request) {
    var orderCard = service.createOrderCard(request);

    URI location = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .path("/{cardId}")
        .buildAndExpand(orderCard.getId())
        .toUri();

    return ResponseEntity.created(location).body(new ResponseOrderCard(orderCard));
  }

  @GetMapping("/{cardId}")
  public ResponseEntity<ResponseOrderCard> readCard(@PathVariable @Valid RequestOrderCard cardId) {
    var response = new ResponseOrderCard(service.takeOrderCardById(cardId.cardId()));

    return ResponseEntity.ok(response);
  }

  @GetMapping()
  public ResponseEntity<Page<ResponseOrderCard>> readAllCards(Pageable pageable) {
    var cards = service.pageAllOrderCards(pageable);

    var response = cards.map(ResponseOrderCard::new);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/active")
  public ResponseEntity<Page<ResponseSummaryOrderCard>> readActiveCards(Pageable pageable) {
    var cards = service.pageActiveOrderCards(pageable);

    var response = cards.map(ResponseSummaryOrderCard::new);
    return ResponseEntity.ok(response);
  }
}

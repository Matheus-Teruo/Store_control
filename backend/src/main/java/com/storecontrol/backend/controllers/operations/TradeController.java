package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.operations.request.RequestCreateRecharge;
import com.storecontrol.backend.models.operations.trades.request.RequestCreateTrade;
import com.storecontrol.backend.models.operations.trades.response.ResponseSummaryTrade;
import com.storecontrol.backend.models.operations.trades.response.ResponseTrade;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.services.operations.TradeService;
import com.storecontrol.backend.services.volunteers.VoluntaryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("trades")
public class TradeController {

  @Autowired
  private TradeService service;

  @Autowired
  private VoluntaryService voluntaryService;

  @PostMapping
  public ResponseEntity<ResponseTrade> createTrade(@RequestBody @Valid RequestCreateTrade request) {
    var rechargeRequest = new RequestCreateRecharge(
        request.rechargeValue(),
        request.paymentTypeEnum(),
        request.orderCardId(),
        request.cashRegisterUuid()
    );

    var purchaseRequest = new RequestCreatePurchase(
        request.onOrder(),
        request.standUuid(),
        request.items(),
        request.orderCardId()
    );

    var trade = service.createTrade(rechargeRequest, purchaseRequest);

    Voluntary voluntary = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    URI location = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .path("/{uuid}")
        .buildAndExpand(trade.getUuid())
        .toUri();

    return ResponseEntity.created(location).body(new ResponseTrade(trade, voluntary));
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseTrade> readTrade(@PathVariable @Valid UUID uuid) {
    var trade = service.takeTradeByUuid(uuid);

    var voluntary = voluntaryService.safeTakeVoluntaryByUuid(trade.getVoluntaryUuid());

    return ResponseEntity.ok(new ResponseTrade(trade, voluntary));
  }

  @GetMapping
  public ResponseEntity<Page<ResponseSummaryTrade>> readTrades(
      @RequestParam(required = false) UUID standUuid,
      Pageable pageable) {
    var tradeView = service.pageTrades(standUuid, pageable);
    var response = tradeView.map(ResponseSummaryTrade::new);

    return ResponseEntity.ok(response);
  }

  @GetMapping("/last3")
  public ResponseEntity<List<ResponseSummaryTrade>> readLast3Purchases() {
    var trades = service.listLast3Trades();

    var response = trades.stream().map(ResponseSummaryTrade::new).toList();
    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{cardId}/{uuid}")
  public ResponseEntity<Void> deleteTrade(
      @PathVariable @Valid String cardId,
      @PathVariable @Valid UUID uuid
  ) {
    service.deleteTrade(cardId, uuid);

    return ResponseEntity.noContent().build();
  }
}

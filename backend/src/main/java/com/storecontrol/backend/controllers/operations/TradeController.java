package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.operations.request.RequestCreateRecharge;
import com.storecontrol.backend.models.operations.trades.request.RequestCreateTrade;
import com.storecontrol.backend.models.operations.trades.response.ResponseSummaryTrade;
import com.storecontrol.backend.models.operations.trades.response.ResponseTrade;
import com.storecontrol.backend.services.operations.TradeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("trades")
public class TradeController {

  @Autowired
  private TradeService service;

  @PostMapping
  public ResponseEntity<ResponseTrade> createTrade(
      @RequestBody @Valid RequestCreateTrade request,
      @RequestAttribute("UserUuid") UUID userUuid
  ) {
    var rechargeRequest = new RequestCreateRecharge(
        request.rechargeValue(),
        request.paymentTypeEnum(),
        request.orderCardId(),
        request.cashRegisterUuid()
    );

    var purchaseRequest = new RequestCreatePurchase(
        request.onOrder(),
        request.items(),
        request.orderCardId()
    );

    var trade = service.createTrade(rechargeRequest, purchaseRequest, userUuid);

    URI location = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .path("/{uuid}")
        .buildAndExpand(trade.getUuid())
        .toUri();

    return ResponseEntity.created(location).body(new ResponseTrade(trade));
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseTrade> readTrade(@PathVariable @Valid UUID uuid) {
    var response = new ResponseTrade(service.takeTradeByUuid(uuid));

    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<Page<ResponseSummaryTrade>> readTrades(
      @RequestParam(required = false) UUID standUuid,
      @RequestAttribute("UserUuid") UUID userUuid,
      Pageable pageable) {
    var tradeView = service.pageTrades(standUuid, userUuid, pageable);
    var response = tradeView.map(ResponseSummaryTrade::new);

    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{cardId}/{uuid}")
  public ResponseEntity<Void> deleteTrade(
      @PathVariable @Valid String cardId,
      @PathVariable @Valid UUID uuid,
      @RequestAttribute("UserUuid") UUID userUuid
  ) {
    service.deleteTrade(cardId, uuid, userUuid);

    return ResponseEntity.noContent().build();
  }
}

package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.operations.request.RequestCreateRecharge;
import com.storecontrol.backend.models.operations.request.RequestCreateTrade;
import com.storecontrol.backend.models.operations.response.ResponseTrade;
import com.storecontrol.backend.services.operations.TradeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("trades")
public class TradeController {

  @Autowired
  TradeService service;

  @PostMapping
  public ResponseEntity<ResponseTrade> createRecharge(
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

    var response = service.createTrade(rechargeRequest, purchaseRequest, userUuid);

    return ResponseEntity.ok(response);
  }
}

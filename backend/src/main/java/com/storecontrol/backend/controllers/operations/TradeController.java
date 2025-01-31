package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.customers.request.RequestOrderCard;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.operations.request.RequestCreateRecharge;
import com.storecontrol.backend.models.operations.request.RequestCreateTrade;
import com.storecontrol.backend.models.operations.response.ResponseTrade;
import com.storecontrol.backend.services.customers.CustomerFinalizationHandler;
import com.storecontrol.backend.services.customers.CustomerService;
import com.storecontrol.backend.services.customers.OrderCardService;
import com.storecontrol.backend.services.operations.PurchaseService;
import com.storecontrol.backend.services.operations.RechargeService;
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

  @Autowired
  RechargeService rechargeService;

  @Autowired
  PurchaseService purchaseService;

  @Autowired
  OrderCardService orderCardService;

  @Autowired
  CustomerService customerService;

  @Autowired
  CustomerFinalizationHandler customerFinalizationHandler;

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

    var response = service.createTrade(rechargeRequest, purchaseRequest, userUuid);

    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{cardId}")
  public ResponseEntity<ResponseTrade> deleteTrade(
      @PathVariable @Valid String cardId,
      @RequestAttribute("UserUuid") UUID userUuid
  ) {
    var card = orderCardService.takeOrderCardById(cardId);

    Customer customer;
    if (card.isActive()) {
      customer = customerService.takeActiveCustomerByCardId(card.getId());
    } else {
      var requestOrderCard = new RequestOrderCard(card.getId());
      customer = customerFinalizationHandler.undoFinalizeCustomer(requestOrderCard, userUuid);
    }

    purchaseService.deletePurchase(customer.getPurchases().getFirst().getUuid(), userUuid);

    rechargeService.deleteRecharge(customer.getRecharges().getFirst().getUuid(), userUuid);

    var response = new ResponseTrade(customer.getRecharges().getFirst(), customer.getPurchases().getFirst());
    return ResponseEntity.ok(response);
  }
}

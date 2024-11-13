package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.item.RequestUpdateItem;
import com.storecontrol.backend.controllers.request.orderCard.RequestUpdateOrderCard;
import com.storecontrol.backend.controllers.request.purchase.RequestPurchase;
import com.storecontrol.backend.controllers.request.purchase.RequestUpdatePurchase;
import com.storecontrol.backend.models.Good;
import com.storecontrol.backend.models.Purchase;
import com.storecontrol.backend.repositories.PurchaseRepository;
import com.storecontrol.backend.services.validation.PurchaseValidate;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class PurchaseService {

  @Autowired
  PurchaseRepository repository;

  @Autowired
  PurchaseValidate validate;

  @Autowired
  VoluntaryService voluntaryService;

  @Autowired
  CustomerService customerService;

  @Autowired
  GoodService goodService;

  @Transactional
  public Purchase createPurchase(RequestPurchase request) {
    var voluntary = voluntaryService.takeVoluntaryByUuid(request.voluntaryId());
    var customer = customerService.takeActiveCustomerByCardId(request.orderCardId());

    validate.checkInsufficientCreditValidity(request, customer);
    validate.checkInsufficientStockItemValidity(request);

    var purchase =  new Purchase(request, customer,  voluntary);

    var goods = goodService.createGoods(request, purchase);
    purchase.allocateGoodsToPurchase(goods);

    updateItemsFromGoodsChanged(purchase, false);
    updateCustomerDebit(purchase, false);
    repository.save(purchase);

    return purchase;
  }

  public Purchase takePurchaseByUuid(String uuid) {
    var purchaseOptional = repository.findByUuidValidTrue(UUID.fromString(uuid));

    return purchaseOptional.orElseGet(Purchase::new);  // TODO: ERROR: purchase_uuid invalid
  }

  public List<Purchase> listPurchases() {
    return repository.findAllValidTrue();
  }

  @Transactional
  public Purchase updatePurchase(RequestUpdatePurchase request) {
    var purchase = takePurchaseByUuid(request.uuid());

    purchase.updatePurchase(request);
    purchase.updateGoodsFromPurchase(request.requestUpdateGoods());

    return purchase;
  }

  @Transactional
  public void deletePurchase(RequestUpdatePurchase request) {
    var purchase = takePurchaseByUuid(request.uuid());

    validate.checkSomeGoodWasDelivered(purchase);

    updateItemsFromGoodsChanged(purchase, true);
    updateCustomerDebit(purchase, true);

    purchase.deletePurchase();
  }

  private void updateItemsFromGoodsChanged(Purchase purchase, Boolean isReversal) {
    for (Good good : purchase.getGoods()) {
      var item = good.getGoodId().getItem();
      int adjustmentFactor = isReversal ? 1 : -1;

      item.updateItem(new RequestUpdateItem(
          item.getUuid().toString(),
          null,
          null,
          item.getStock() + (adjustmentFactor * good.getQuantity()),
          null,
          null));
    }
  }

  private void updateCustomerDebit(Purchase purchase, Boolean isReversal) {
    var totalValue = purchase.getGoods().stream().map(good ->
            BigDecimal.valueOf(good.getQuantity())
                .multiply(good.getUnitPrice()))
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    var orderCard = purchase.getCustomer().getOrderCard();

    BigDecimal adjustmentFactor = isReversal ? BigDecimal.ONE : BigDecimal.valueOf(-1);

    var debitResult = orderCard.getDebit().add(totalValue.multiply(adjustmentFactor));

    var requestUpdateOrderCard = new RequestUpdateOrderCard(
        orderCard.getId(),
        debitResult.toString(),
        null);

    orderCard.updateOrderCard(requestUpdateOrderCard);
  }
}

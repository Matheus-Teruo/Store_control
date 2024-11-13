package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.item.RequestUpdateItem;
import com.storecontrol.backend.controllers.request.orderCard.RequestUpdateOrderCard;
import com.storecontrol.backend.controllers.request.purchase.RequestPurchase;
import com.storecontrol.backend.controllers.request.purchase.RequestUpdatePurchase;
import com.storecontrol.backend.models.PurchaseItem;
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
  PurchaseItemService purchaseItemService;

  @Transactional
  public Purchase createPurchase(RequestPurchase request) {
    var voluntary = voluntaryService.takeVoluntaryByUuid(request.voluntaryId());
    var customer = customerService.takeActiveCustomerByCardId(request.orderCardId());

    validate.checkInsufficientCreditValidity(request, customer);
    validate.checkInsufficientStockItemValidity(request);

    var purchase =  new Purchase(request, customer,  voluntary);

    var purchaseItems = purchaseItemService.createPurchaseItems(request, purchase);
    purchase.allocatePurchaseItemsToPurchase(purchaseItems);

    updateItemsFromPurchaseItemsChanged(purchase, false);
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
    purchase.updatePurchaseItemsFromPurchase(request.requestUpdatePurchaseItems());

    return purchase;
  }

  @Transactional
  public void deletePurchase(RequestUpdatePurchase request) {
    var purchase = takePurchaseByUuid(request.uuid());

    validate.checkSomePurchaseItemWasDelivered(purchase);

    updateItemsFromPurchaseItemsChanged(purchase, true);
    updateCustomerDebit(purchase, true);

    purchase.deletePurchase();
  }

  private void updateItemsFromPurchaseItemsChanged(Purchase purchase, Boolean isReversal) {
    for (PurchaseItem purchaseItem : purchase.getPurchaseItems()) {
      var item = purchaseItem.getPurchaseItemId().getItem();
      int adjustmentFactor = isReversal ? 1 : -1;

      item.updateItem(new RequestUpdateItem(
          item.getUuid().toString(),
          null,
          null,
          item.getStock() + (adjustmentFactor * purchaseItem.getQuantity()),
          null,
          null));
    }
  }

  private void updateCustomerDebit(Purchase purchase, Boolean isReversal) {
    var totalValue = purchase.getPurchaseItems().stream().map(purchaseItem ->
            BigDecimal.valueOf(purchaseItem.getQuantity())
                .multiply(purchaseItem.getUnitPrice()))
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

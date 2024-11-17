package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.product.RequestUpdateProduct;
import com.storecontrol.backend.controllers.request.purchase.RequestPurchase;
import com.storecontrol.backend.controllers.request.purchase.RequestUpdatePurchase;
import com.storecontrol.backend.controllers.request.item.RequestUpdateItem;
import com.storecontrol.backend.models.Item;
import com.storecontrol.backend.models.Purchase;
import com.storecontrol.backend.repositories.PurchaseRepository;
import com.storecontrol.backend.services.validation.PurchaseValidate;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
  ItemService itemService;

  @Transactional
  public Purchase createPurchase(RequestPurchase request) {
    var voluntary = voluntaryService.takeVoluntaryByUuid(request.voluntaryId());
    var customer = customerService.takeActiveCustomerByCardId(request.orderCardId());

    validate.checkInsufficientCreditValidity(request, customer);
    validate.checkInsufficientProductStockValidity(request);

    var purchase =  new Purchase(request, customer,  voluntary);

    var items = itemService.createItems(request, purchase);
    purchase.allocateItemsToPurchase(items);

    updateItemsFromItemsChanged(purchase, false);
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
    updateItemsFromPurchase(request.requestUpdateItems(), purchase.getItems());

    return purchase;
  }

  @Transactional
  public void deletePurchase(RequestUpdatePurchase request) {
    var purchase = takePurchaseByUuid(request.uuid());

    validate.checkSomeItemWasDelivered(purchase);

    updateItemsFromItemsChanged(purchase, true);
    updateCustomerDebit(purchase, true);

    purchase.deletePurchase();
  }

  private void updateItemsFromItemsChanged(Purchase purchase, Boolean isReversal) {
    for (Item item : purchase.getItems()) {
      var product = item.getItemId().getProduct();
      int adjustmentFactor = isReversal ? 1 : -1;

      product.updateProduct(new RequestUpdateProduct(
          product.getUuid().toString(),
          null,
          null,
          product.getStock() + (adjustmentFactor * item.getQuantity()),
          null,
          null));
    }
  }

  private void updateCustomerDebit(Purchase purchase, Boolean isReversal) {
    var totalValue = purchase.getItems().stream().map(item ->
            BigDecimal.valueOf(item.getQuantity())
                .multiply(item.getUnitPrice()))
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    var orderCard = purchase.getCustomer().getOrderCard();

    BigDecimal adjustmentFactor = isReversal ? BigDecimal.ONE : BigDecimal.valueOf(-1);

    var debitResult = orderCard.getDebit().add(totalValue.multiply(adjustmentFactor));

    purchase.getCustomer().getOrderCard().incrementDebit(debitResult);
  }

  public void updateItemsFromPurchase(List<RequestUpdateItem> request, List<Item> items) {
    if (request != null && !request.isEmpty()) {

      var itemsMap = items.stream().collect(Collectors.toMap(
          item -> item.getItemId().getProduct().getUuid().toString(),
          item -> item
      ));

      request.forEach(requestUpdateItem -> {
        var item = itemsMap.get(requestUpdateItem.productId());
        if (item != null) {
          if (requestUpdateItem.delivered() <= item.getQuantity()) {
            item.updateItem(requestUpdateItem);
          } // else
            // TODO: error quantity not allow to be bigger than quantity.
        } // else
          // TODO: error. this item is not allocate in this purchase like item
      });
    }
  }
}

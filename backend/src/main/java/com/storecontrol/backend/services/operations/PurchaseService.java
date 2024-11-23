package com.storecontrol.backend.services.operations;

import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestUpdateItem;
import com.storecontrol.backend.models.operations.purchases.request.RequestUpdatePurchase;
import com.storecontrol.backend.models.stands.request.RequestUpdateProduct;
import com.storecontrol.backend.repositories.operations.PurchaseRepository;
import com.storecontrol.backend.services.customers.CustomerService;
import com.storecontrol.backend.services.operations.validation.PurchaseValidation;
import com.storecontrol.backend.services.volunteers.VoluntaryService;
import jakarta.persistence.EntityNotFoundException;
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
  PurchaseValidation validate;

  @Autowired
  PurchaseRepository repository;

  @Autowired
  VoluntaryService voluntaryService;

  @Autowired
  CustomerService customerService;

  @Autowired
  ItemService itemService;

  @Transactional
  public Purchase createPurchase(RequestCreatePurchase request) {
    var voluntary = voluntaryService.safeTakeVoluntaryByUuid(request.voluntaryId());
    var customer = customerService.takeActiveCustomerByCardId(request.orderCardId());

    validate.checkVoluntaryFunctionMatch(voluntary);
    validate.checkInsufficientCreditValidity(request, customer);
    validate.checkInsufficientProductStockValidity(request);

    var purchase = new Purchase(request, customer,  voluntary);

    repository.save(purchase);
    var items = itemService.createItems(request, purchase);
    purchase.setItems(items);

    updateItemsFromItemsChanged(purchase, false);
    updateCustomerDebit(purchase, false);

    return purchase;
  }

  public Purchase takePurchaseByUuid(UUID uuid) {
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(EntityNotFoundException::new);
  }

  public Purchase safeTakePurchaseByUuid(UUID uuid) {
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(() -> new InvalidDatabaseQueryException("Non-existent entity", "Purchase", uuid.toString()));
  }

  public List<Purchase> listPurchases() {
    return repository.findAllValidTrue();
  }

  @Transactional
  public Purchase updatePurchase(RequestUpdatePurchase request) {
    var purchase = safeTakePurchaseByUuid(request.uuid());

    validate.checkItemsFromPurchaseValidation(request.updateItems(), purchase.getItems());

    purchase.updatePurchase(request);
    updateItemsFromPurchase(request.updateItems(), purchase.getItems());

    return purchase;
  }

  @Transactional
  public void deletePurchase(RequestUpdatePurchase request) {
    var purchase = safeTakePurchaseByUuid(request.uuid());

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
          product.getUuid(),
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

    BigDecimal adjustmentFactor = isReversal ? BigDecimal.ONE : BigDecimal.ONE.negate();

    purchase.getCustomer().getOrderCard().incrementDebit(totalValue.multiply(adjustmentFactor));
  }

  public void updateItemsFromPurchase(List<RequestUpdateItem> request, List<Item> items) {
    if (request != null && !request.isEmpty()) {

      var itemsMap = items.stream().collect(Collectors.toMap(
          item -> item.getItemId().getProduct().getUuid(),
          item -> item
      ));

      request.forEach(requestUpdateItem -> {
        var item = itemsMap.get(requestUpdateItem.productId());
        if (item != null) {
          if (requestUpdateItem.delivered() <= item.getQuantity()) {
            item.updateItem(requestUpdateItem);
          }
        }
      });
    }
  }
}

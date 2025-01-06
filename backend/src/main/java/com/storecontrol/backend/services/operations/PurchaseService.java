package com.storecontrol.backend.services.operations;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestUpdateItem;
import com.storecontrol.backend.models.operations.purchases.request.RequestUpdatePurchase;
import com.storecontrol.backend.repositories.operations.PurchaseRepository;
import com.storecontrol.backend.services.customers.CustomerService;
import com.storecontrol.backend.services.operations.validation.PurchaseValidation;
import com.storecontrol.backend.services.stands.ProductService;
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
  PurchaseValidation validation;

  @Autowired
  PurchaseRepository repository;

  @Autowired
  ProductService productService;

  @Autowired
  VoluntaryService voluntaryService;

  @Autowired
  CustomerService customerService;

  @Autowired
  ItemService itemService;

  @Transactional
  public Purchase createPurchase(RequestCreatePurchase request, UUID userUuid) {
    var voluntary = voluntaryService.safeTakeVoluntaryByUuid(userUuid);
    validation.checkVoluntaryFunctionMatch(voluntary);

    var productMap = productService.listProductsAsMap();
    var customer = customerService.takeActiveCustomerByCardId(request.orderCardId());
    validation.checkItemPriceAndDiscountMatch(request, voluntary, productMap);
    validation.checkInsufficientDebitValidity(request, customer);
    validation.checkInsufficientProductStockValidity(request, productMap);

    var purchase = new Purchase(request, customer,  voluntary);
    var items = itemService.createItems(request, purchase);
    purchase.setItems(items);

    updateItemsFromItemsChanged(purchase, false);
    updateCustomerDebit(purchase, false);

    repository.save(purchase);
    return purchase;
  }

  public Purchase takePurchaseByUuid(UUID uuid) {
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(EntityNotFoundException::new);
  }

  public Purchase safeTakePurchaseByUuid(UUID uuid) {
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(() -> new InvalidDatabaseQueryException(
            MessageResolver.getInstance().getMessage("service.exception.purchase.get.validation.error"),
            MessageResolver.getInstance().getMessage("service.exception.purchase.get.validation.message"),
            uuid.toString())
        );
  }

  public List<Purchase> listPurchases() {
    return repository.findAllValidTrue();
  }

  public List<Purchase> listLast3Purchases(UUID voluntaryUuid) {
    return repository.findLast3ValidTrue(voluntaryUuid);
  }

  @Transactional
  public Purchase updatePurchase(RequestUpdatePurchase request) {
    var purchase = safeTakePurchaseByUuid(request.uuid());

    validation.checkItemsFromPurchaseValidation(request.updateItems(), purchase.getItems());

    purchase.updatePurchase(request);
    updateItemsFromPurchase(request.updateItems(), purchase.getItems());

    return purchase;
  }

  @Transactional
  public void deletePurchase(RequestUpdatePurchase request, UUID userUuid) {
    var purchase = safeTakePurchaseByUuid(request.uuid());
    var voluntary = voluntaryService.safeTakeVoluntaryByUuid(userUuid);

    validation.checkSomeItemWasDelivered(purchase);
    validation.checkPurchaseBelongsToVoluntary(purchase, userUuid);
    validation.checkIfLastPurchaseOfVoluntary(purchase, voluntary);

    updateItemsFromItemsChanged(purchase, true);
    updateCustomerDebit(purchase, true);

    purchase.deletePurchase();
  }

  private void updateItemsFromItemsChanged(Purchase purchase, Boolean isReversal) {
    for (Item item : purchase.getItems()) {
      var product = item.getItemId().getProduct();
      int adjustmentFactor = isReversal ? -1 : 1;

      product.decreaseStock(adjustmentFactor * item.getQuantity());
    }
  }

  private void updateCustomerDebit(Purchase purchase, Boolean isReversal) {
    var totalValue = purchase.getItems().stream().map(item ->
            BigDecimal.valueOf(item.getQuantity())
                .multiply(item.getUnitPrice().subtract(item.getDiscount())))
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
        var item = itemsMap.get(requestUpdateItem.productUuid());
        if (item != null) {
          if (requestUpdateItem.delivered() <= item.getQuantity()) {
            item.updateItem(requestUpdateItem);
          }
        }
      });
    }
  }
}

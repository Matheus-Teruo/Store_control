package com.storecontrol.backend.services.operations;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestUpdateItem;
import com.storecontrol.backend.models.operations.purchases.request.RequestUpdatePurchase;
import com.storecontrol.backend.models.stands.products.Product;
import com.storecontrol.backend.models.stands.products.ProductCombo;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.repositories.operations.PurchaseRepository;
import com.storecontrol.backend.services.customers.CustomerService;
import com.storecontrol.backend.services.operations.validation.PurchaseValidation;
import com.storecontrol.backend.services.stands.ProductService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PurchaseService {

  @Autowired
  private PurchaseValidation validation;

  @Autowired
  private PurchaseRepository repository;

  @Autowired
  private ProductService productService;

  @Autowired
  private CustomerService customerService;

  @Autowired
  private ItemService itemService;

  @Transactional
  public Purchase createPurchase(RequestCreatePurchase request) {
    Voluntary voluntary = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    validation.checkVoluntaryFunctionMatch(request.standUuid(), voluntary);

    Map<UUID, Product> productMap = productService.listProductsAsMap(request.standUuid());
    var customer = customerService.takeActiveCustomerByCardId(request.orderCardId());
    validation.checkStandFromItems(voluntary, request.items(), productMap);
    validation.checkItemPriceAndDiscountMatch(request, voluntary, productMap);
    validation.checkInsufficientDebitValidity(request, customer);
    validation.checkPurchaseHaveItems(request);
    validation.checkInsufficientProductStockValidity(request, productMap);

    boolean onOrder = request.items().stream().anyMatch(
        item -> item.delivered() != null && !item.delivered().equals(item.quantity()));
    UUID standUuid = productMap.get(request.items().getFirst().productUuid()).getStandUuid();
    var purchase = new Purchase(onOrder, standUuid, customer, voluntary, false);
    var items = itemService.createItems(request, purchase, standUuid);
    purchase.setItems(items);

    updateItemsFromItemsChanged(purchase, productMap, false);
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

  public Page<Purchase> pagePurchases(UUID standUuid, Pageable pageable) {
    Voluntary manager = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    validation.checkPurchasesBelongsManagerStand(standUuid, manager);

    return repository.findAllValidTrue(standUuid, pageable);
  }

  public Map<UUID, List<Item>> takeItensToPurchaseList(List<UUID> purchaseUuids) {
    List<Item> allItems = repository.findByPurchasesUuid(purchaseUuids);

    return allItems.stream()
        .collect(Collectors.groupingBy(item -> item.getItemId().getPurchase().getUuid()));
  }


  public List<Purchase> listLast3Purchases() {
    Voluntary manager = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    return repository.findLast3ValidTrue(manager.getUuid());
  }

  @Transactional
  public Purchase updatePurchase(RequestUpdatePurchase request) {
    var purchase = safeTakePurchaseByUuid(request.uuid());
    Map<UUID, Item> mapItem = purchase.getItems().stream()
        .collect(Collectors.toMap(Item::getProductUuid, Function.identity()));
    validation.checkItemsFromPurchaseValidation(request.items(), purchase.getItems());

    if (request.items().stream().anyMatch(item -> item.delivered() != null)) {
      boolean onOrder = request.items().stream()
          .anyMatch(
              item -> item.delivered() != null &&
                  !item.delivered().equals(mapItem.get(item.productUuid()).getQuantity()));
      purchase.updatePurchase(onOrder);
    }
    updateItemsFromPurchase(request.items(), purchase.getItems());

    return purchase;
  }

  @Transactional
  public void deletePurchase(UUID uuid) {
    Voluntary voluntary = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    var purchase = safeTakePurchaseByUuid(uuid);

    Map<UUID, Product> productMap = productService.listProductsAsMap(purchase.getStandUuid());

    validation.checkSomeItemWasDelivered(purchase);
    validation.checkPurchaseBelongsToVoluntary(purchase, voluntary);
    validation.checkIfLastPurchaseOfVoluntary(purchase, voluntary);

    updateItemsFromItemsChanged(purchase, productMap, true);
    updateCustomerDebit(purchase, true);

    purchase.deletePurchase();
  }

  private void updateItemsFromItemsChanged(Purchase purchase, Map<UUID, Product> productMap, Boolean isReversal) {
    for (Item item : purchase.getItems()) {
      var product = item.getItemId().getProduct();
      int adjustmentFactor = isReversal ? -1 : 1;

      if (product.isCombo()) {
        for (ProductCombo productCombo : product.getComboProducts()) {
          var comboProduct = productMap.get(productCombo.getProductIncludedUuid());
          if (comboProduct.getStock() != null) {
            comboProduct.decreaseStock(adjustmentFactor * item.getQuantity() * productCombo.getQuantity());
          }
        }
      }

      if (product.getStock() != null) {
        product.decreaseStock(adjustmentFactor * item.getQuantity());
      }
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

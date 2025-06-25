package com.storecontrol.backend.services.operations;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.enumerate.PaymentType;
import com.storecontrol.backend.models.operations.recharges.Recharge;
import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.operations.recharges.request.RequestCreateRecharge;
import com.storecontrol.backend.models.operations.trades.Trade;
import com.storecontrol.backend.models.operations.trades.TradeView;
import com.storecontrol.backend.models.stands.products.Product;
import com.storecontrol.backend.models.stands.products.ProductCombo;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.repositories.operations.PurchaseRepository;
import com.storecontrol.backend.repositories.operations.RechargeRepository;
import com.storecontrol.backend.repositories.operations.TradeRepository;
import com.storecontrol.backend.repositories.operations.TradeViewRepository;
import com.storecontrol.backend.services.customers.CustomerService;
import com.storecontrol.backend.services.operations.validation.PurchaseValidation;
import com.storecontrol.backend.services.operations.validation.RechargeValidation;
import com.storecontrol.backend.services.operations.validation.TradeValidation;
import com.storecontrol.backend.services.registers.RegisterService;
import com.storecontrol.backend.services.stands.ProductService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class TradeService {

  @Autowired
  private RechargeValidation rechargeValidation;

  @Autowired
  private PurchaseValidation purchaseValidation;

  @Autowired
  private TradeValidation validation;

  @Autowired
  private TradeRepository repository;

  @Autowired
  private TradeViewRepository repositoryView;

  @Autowired
  private RechargeRepository rechargeRepository;

  @Autowired
  private PurchaseRepository purchaseRepository;

  @Autowired
  private ProductService productService;

  @Autowired
  private CustomerService customerService;

  @Autowired
  private RegisterService registerService;

  @Autowired
  private ItemService itemService;

  @Value("${spring.flyway.placeholders.CARD_ID}")
  private String fixedCardId;

  @Transactional
  public TradeView createTrade(RequestCreateRecharge rechargeRequest, RequestCreatePurchase purchaseRequest) {
    Voluntary voluntary = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    purchaseValidation.checkVoluntaryFunctionMatch(purchaseRequest.standUuid(), voluntary);

    var productMap = productService.listProductsAsMap(purchaseRequest.standUuid());
    purchaseValidation.checkStandFromItems(voluntary, purchaseRequest.items(), productMap);
    purchaseValidation.checkItemPriceAndDiscountMatch(purchaseRequest, voluntary, productMap);
    purchaseValidation.checkPurchaseHaveItems(purchaseRequest);
    purchaseValidation.checkInsufficientProductStockValidity(purchaseRequest, productMap);
    validation.checkRechargeMatchTotalPrice(rechargeRequest, purchaseRequest);

    var register = registerService.safeTakeRegisterByStandUuid(purchaseRequest.standUuid());

    boolean onOrder = purchaseRequest.items().stream().anyMatch(
        item -> item.delivered() != null && !item.delivered().equals(item.quantity()));
    var customer = handleChangesOnCustomerByCardId(rechargeRequest, onOrder);

    var recharge = new Recharge(rechargeRequest, customer, register, voluntary);
    handleCashTotal(recharge, recharge.getPaymentTypeEnum(), false);

    rechargeRepository.save(recharge);

    boolean hasReverseQuantity = purchaseRequest.items().stream()
        .anyMatch(item -> item.quantity() < 0);
    var purchase = new Purchase(onOrder, purchaseRequest.standUuid(), customer, voluntary, hasReverseQuantity);
    var items = itemService.createItems(purchaseRequest, purchase, purchaseRequest.standUuid());
    purchase.setItems(items);

    updateItemsFromItemsChanged(purchase, productMap, false);

    purchaseRepository.save(purchase);

    if (!onOrder) {
      customerService.finalizeCustomer(customer, false);
    }

    Trade trade = new Trade(recharge.getUuid(), purchase.getUuid());

    repository.save(trade);

    return new TradeView(trade, recharge, purchase);
  }

  public TradeView takeTradeByUuid(UUID uuid) {
    var trade = repositoryView.findByUuidValidTrue(uuid)
        .orElseThrow(EntityNotFoundException::new);

    var items = itemService.listItems(trade.getPurchaseUuid());
    trade.setItems(items);

    return trade;
  }

  public Page<TradeView> pageTrades(UUID standUuid, Pageable pageable) {
    Voluntary manager = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    purchaseValidation.checkPurchasesBelongsManagerStand(standUuid, manager);

    var trades = repositoryView.findTradesValid(standUuid, pageable);
    List<UUID> purchasesUUid = trades.stream().map(TradeView::getPurchaseUuid).toList();

    Map<UUID, List<Item>> itemMap = itemService.listItemsFromMultiPurchase(purchasesUUid);
    trades.forEach(tradeView -> {
      List<Item> items = itemMap.getOrDefault(tradeView.getPurchaseUuid(), new ArrayList<>());
      tradeView.setItems(items);
    });

    return trades;
  }

  public List<TradeView> listLast3Trades() {
    Voluntary manager = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    var trades = repositoryView.findLast3ValidTrue(manager.getUuid());

    List<UUID> purchasesUUid = trades.stream().map(TradeView::getPurchaseUuid).toList();

    Map<UUID, List<Item>> itemMap = itemService.listItemsFromMultiPurchase(purchasesUUid);
    trades.forEach(tradeView -> {
      List<Item> items = itemMap.getOrDefault(tradeView.getPurchaseUuid(), new ArrayList<>());
      tradeView.setItems(items);
    });

    return trades;
  }

  @Transactional
  public void deleteTrade(String cardId, UUID uuid) {
    Voluntary voluntary = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    var trade = repository.findByUuidValidTrue(uuid)
        .orElseThrow(EntityNotFoundException::new);

    Customer customer;
    Purchase purchase;
    Recharge recharge;
    if (fixedCardId.equals(cardId)) {
      recharge = rechargeRepository.findByUuidValidTrue(trade.getRechargeUuid())
          .orElseThrow(() -> new InvalidDatabaseQueryException(
              MessageResolver.getInstance().getMessage("service.exception.recharge.get.validation.error"),
              MessageResolver.getInstance().getMessage("service.exception.recharge.get.validation.message"),
              uuid.toString())
          );
      purchase = purchaseRepository.findByUuidValidTrue(trade.getPurchaseUuid())
          .orElseThrow(() -> new InvalidDatabaseQueryException(
              MessageResolver.getInstance().getMessage("service.exception.purchase.get.validation.error"),
              MessageResolver.getInstance().getMessage("service.exception.purchase.get.validation.message"),
              uuid.toString())
          );
      customer = recharge.getCustomer();
    } else {
      customer = customerService.takeActiveCustomerByCardId(cardId);
      purchase = customer.getPurchases().getFirst();
      recharge = customer.getRecharges().getFirst();
    }

    var productMap = productService.listProductsAsMap(purchase.getStandUuid());
    validation.checkIfLastTrade(recharge, purchase, trade);
    if (!fixedCardId.equals(cardId)) purchaseValidation.checkSomeItemWasDelivered(purchase);
    purchaseValidation.checkPurchaseBelongsToVoluntary(purchase, voluntary);
    rechargeValidation.checkRechargeBelongsToVoluntary(recharge, voluntary);
    if (fixedCardId.equals(cardId)) {
      purchaseValidation.checkIfLastPurchaseOfVoluntary(purchase, voluntary);
      rechargeValidation.checkIfLastRechargeOfVoluntary(recharge, voluntary);
    }

    updateItemsFromItemsChanged(purchase, productMap,true);

    purchase.deletePurchase();

    handleCashTotal(recharge, recharge.getPaymentTypeEnum(), true);

    recharge.deleteRecharge();

    trade.deleteTrade();

    handleFilterFinalizeCustomer(customer);
  }

  private Customer handleChangesOnCustomerByCardId(RequestCreateRecharge request, boolean onOrder) {
    Customer customer;
    if (onOrder) {
      customer = customerService.initializeCustomer(request.orderCardId());
    } else {
      try {
        customer = customerService.takeActiveCustomerByCardId(request.orderCardId());
      } catch (InvalidDatabaseQueryException ex) {
        customer = customerService.initializeCustomer(request.orderCardId());
      }
    }
    return customer;
  }

  private void handleCashTotal(Recharge recharge, PaymentType paymentType, Boolean isReversal) {

    BigDecimal adjustmentFactor = isReversal ? BigDecimal.ONE.negate() : BigDecimal.ONE;
    var rechargeValue = recharge.getRechargeValue().multiply(adjustmentFactor);

    switch(paymentType) {
      case PaymentType.CASH:
        recharge.getRegister().incrementCash(rechargeValue);
        break;
      case PaymentType.CREDIT:
        recharge.getRegister().incrementCredit(rechargeValue);
        break;
      case PaymentType.DEBIT:
        recharge.getRegister().incrementDebit(rechargeValue);
        break;
      case PaymentType.PIX:
        recharge.getRegister().incrementPix(rechargeValue);
        break;
    }
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

  private void handleFilterFinalizeCustomer(Customer customer) {
    var recharges = customer.getRecharges().stream()
        .filter(Recharge::isValid)
        .toList();

    if (recharges.isEmpty()) {
      customerService.finalizeCustomer(customer, true);
    }
  }
}

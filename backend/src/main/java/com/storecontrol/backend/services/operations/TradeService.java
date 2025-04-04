package com.storecontrol.backend.services.operations;

import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.customers.request.RequestOrderCard;
import com.storecontrol.backend.models.enumerate.PaymentType;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.operations.purchases.response.ResponseSummaryPurchase;
import com.storecontrol.backend.models.operations.request.RequestCreateRecharge;
import com.storecontrol.backend.models.operations.trades.Trade;
import com.storecontrol.backend.models.operations.trades.TradeView;
import com.storecontrol.backend.repositories.operations.PurchaseRepository;
import com.storecontrol.backend.repositories.operations.RechargeRepository;
import com.storecontrol.backend.repositories.operations.TradeRepository;
import com.storecontrol.backend.repositories.operations.TradeViewRepository;
import com.storecontrol.backend.services.customers.CustomerFinalizationHandler;
import com.storecontrol.backend.services.customers.CustomerService;
import com.storecontrol.backend.services.operations.validation.PurchaseValidation;
import com.storecontrol.backend.services.operations.validation.RechargeValidation;
import com.storecontrol.backend.services.operations.validation.TradeValidation;
import com.storecontrol.backend.services.registers.CashRegisterService;
import com.storecontrol.backend.services.stands.ProductService;
import com.storecontrol.backend.services.volunteers.VoluntaryService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestAttribute;

import java.math.BigDecimal;
import java.util.List;
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
  private VoluntaryService voluntaryService;

  @Autowired
  private CustomerService customerService;

  @Autowired
  private CustomerFinalizationHandler customerFinalizationHandler;

  @Autowired
  private CashRegisterService cashRegisterService;

  @Autowired
  private ItemService itemService;

  @Value("${spring.flyway.placeholders.CARD_ID}")
  private String fixedCardId;

  @Transactional
  public TradeView createTrade(RequestCreateRecharge rechargeRequest, RequestCreatePurchase purchaseRequest, UUID userUuid) {
    var voluntary = voluntaryService.safeTakeVoluntaryByUuid(userUuid);
    purchaseValidation.checkVoluntaryFunctionMatch(voluntary);

    var productMap = productService.listProductsAsMap();
    purchaseValidation.checkStandFromItems(voluntary, purchaseRequest.items(), productMap);
    purchaseValidation.checkItemPriceAndDiscountMatch(purchaseRequest, voluntary, productMap);
    purchaseValidation.checkPurchaseHaveItems(purchaseRequest);
    purchaseValidation.checkInsufficientProductStockValidity(purchaseRequest, productMap);
    validation.checkRechargeMatchTotalPrice(rechargeRequest, purchaseRequest);

    var cashRegister = cashRegisterService.safeTakeCashRegisterByUuid(rechargeRequest.cashRegisterUuid());

    var customer = handleChangesOnCustomerByCardId(rechargeRequest, purchaseRequest.onOrder());

    var recharge = new Recharge(rechargeRequest, customer, cashRegister, voluntary);
    handleCashTotal(recharge, recharge.getPaymentTypeEnum(), false);

    rechargeRepository.save(recharge);

    UUID standUuid = productMap.get(purchaseRequest.items().getFirst().productUuid()).getStandUuid();
    var purchase = new Purchase(purchaseRequest, standUuid, customer, voluntary);
    var items = itemService.createItems(purchaseRequest, purchase);
    purchase.setItems(items);

    updateItemsFromItemsChanged(purchase, false);

    purchaseRepository.save(purchase);

    if (!purchaseRequest.onOrder()) {
      customerService.finalizeCustomer(customer);
    }

    Trade trade = new Trade(recharge.getUuid(), purchase.getUuid());

    repository.save(trade);

    return new TradeView(trade, recharge, purchase);
  }

  public TradeView takeTradeByUuid(UUID uuid) {
    return repositoryView.findByUuidValidTrue(uuid)
        .orElseThrow(EntityNotFoundException::new);
  }

  public Page<TradeView> pageTrades(UUID standUuid, UUID userUuid, Pageable pageable) {
    purchaseValidation.checkPurchasesBelongsManagerStand(standUuid, userUuid);
    return repositoryView.findTradesValid(standUuid, pageable);
  }

  public List<TradeView> listLast3Purchases( UUID voluntaryUuid) {
    return repositoryView.findLast3ValidTrue(voluntaryUuid);
  }

  @Transactional
  public void deleteTrade(String cardId, UUID uuid, UUID userUuid) {
    var voluntary = voluntaryService.safeTakeVoluntaryByUuid(userUuid);
    var trade = repository.findByUuidValidTrue(uuid)
        .orElseThrow(EntityNotFoundException::new);

    Customer customer;
    if (fixedCardId.equals(cardId)) {
      var requestOrderCard = new RequestOrderCard(cardId);
      customer = customerFinalizationHandler.undoFinalizeCustomer(requestOrderCard, userUuid);
    } else {
      customer = customerService.takeActiveCustomerByCardId(cardId);
    }

    var purchase = customer.getPurchases().getFirst();
    var recharge = customer.getRecharges().getFirst();

    validation.checkIfLastTrade(recharge, purchase, trade);
    if (!fixedCardId.equals(cardId)) purchaseValidation.checkSomeItemWasDelivered(purchase);
    purchaseValidation.checkPurchaseBelongsToVoluntary(purchase, userUuid);
    purchaseValidation.checkIfLastPurchaseOfVoluntary(purchase, voluntary);
    rechargeValidation.checkDebitRemainderPositive(recharge);
    rechargeValidation.checkRechargeBelongsToVoluntary(recharge, userUuid);
    rechargeValidation.checkIfLastRechargeOfVoluntary(recharge, voluntary);

    updateItemsFromItemsChanged(purchase, true);

    purchase.deletePurchase();

    handleCashTotal(recharge, recharge.getPaymentTypeEnum(), true);

    recharge.deleteRecharge();

    trade.deleteTrade();

    handleFilterFinalizeCustomer(recharge.getCustomer());
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
        recharge.getCashRegister().incrementCash(rechargeValue);
        break;
      case PaymentType.CREDIT:
        recharge.getCashRegister().incrementCredit(rechargeValue);
        break;
      case PaymentType.DEBIT:
        recharge.getCashRegister().incrementDebit(rechargeValue);
        break;
    }
  }

  private void updateItemsFromItemsChanged(Purchase purchase, Boolean isReversal) {
    for (Item item : purchase.getItems()) {
      var product = item.getItemId().getProduct();
      int adjustmentFactor = isReversal ? -1 : 1;

      product.decreaseStock(adjustmentFactor * item.getQuantity());
    }
  }

  private void handleFilterFinalizeCustomer(Customer customer) {
    var recharges = customer.getRecharges().stream()
        .filter(Recharge::isValid)
        .toList();

    if (recharges.isEmpty()) {
      customerService.finalizeCustomer(customer);
    }
  }
}

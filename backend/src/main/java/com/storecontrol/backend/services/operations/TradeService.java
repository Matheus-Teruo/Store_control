package com.storecontrol.backend.services.operations;

import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.enumerate.PaymentType;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.operations.request.RequestCreateRecharge;
import com.storecontrol.backend.models.operations.response.ResponseTrade;
import com.storecontrol.backend.repositories.operations.PurchaseRepository;
import com.storecontrol.backend.repositories.operations.RechargeRepository;
import com.storecontrol.backend.services.customers.CustomerService;
import com.storecontrol.backend.services.operations.validation.PurchaseValidation;
import com.storecontrol.backend.services.operations.validation.TradeValidation;
import com.storecontrol.backend.services.registers.CashRegisterService;
import com.storecontrol.backend.services.stands.ProductService;
import com.storecontrol.backend.services.volunteers.VoluntaryService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class TradeService {

  @Autowired
  PurchaseValidation purchaseValidation;

  @Autowired
  TradeValidation validation;

  @Autowired
  RechargeRepository rechargeRepository;

  @Autowired
  PurchaseRepository purchaseRepository;

  @Autowired
  ProductService productService;

  @Autowired
  VoluntaryService voluntaryService;

  @Autowired
  CustomerService customerService;

  @Autowired
  CashRegisterService cashRegisterService;

  @Autowired
  ItemService itemService;

  @Transactional
  public ResponseTrade createTrade(RequestCreateRecharge rechargeRequest, RequestCreatePurchase purchaseRequest, UUID userUuid) {
    var voluntary = voluntaryService.safeTakeVoluntaryByUuid(userUuid);
    purchaseValidation.checkVoluntaryFunctionMatch(voluntary);

    var productMap = productService.listProductsAsMap();
    purchaseValidation.checkItemPriceAndDiscountMatch(purchaseRequest, voluntary, productMap);
    purchaseValidation.checkInsufficientProductStockValidity(purchaseRequest, productMap);
    validation.checkRechargeMatchTotalPrice(rechargeRequest, purchaseRequest);

    var cashRegister = cashRegisterService.safeTakeCashRegisterByUuid(rechargeRequest.cashRegisterUuid());

    var customer = handleChangesOnCustomerByCardId(rechargeRequest, purchaseRequest.onOrder());

    var recharge = new Recharge(rechargeRequest, customer, cashRegister, voluntary);
    handleCashTotal(recharge, recharge.getPaymentTypeEnum(), false);

    rechargeRepository.save(recharge);

    var purchase = new Purchase(purchaseRequest, customer, voluntary);
    var items = itemService.createItems(purchaseRequest, purchase);
    purchase.setItems(items);

    updateItemsFromItemsChanged(purchase, false);

    purchaseRepository.save(purchase);

    if (!purchaseRequest.onOrder()) {
      customerService.finalizeCustomer(customer);
    }

    return new ResponseTrade(recharge, purchase);
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
}

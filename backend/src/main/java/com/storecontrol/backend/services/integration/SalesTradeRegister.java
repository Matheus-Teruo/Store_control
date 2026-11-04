package com.storecontrol.backend.services.integration;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.storecontrol.backend.models.enumerate.PaymentType;
import com.storecontrol.backend.models.integration.response.ExternalSaleDTO;
import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.operations.recharges.Recharge;
import com.storecontrol.backend.models.operations.recharges.request.RequestCreateRecharge;
import com.storecontrol.backend.models.operations.trades.Trade;
import com.storecontrol.backend.models.operations.trades.TradeView;
import com.storecontrol.backend.models.stands.products.Product;
import com.storecontrol.backend.models.stands.products.ProductCombo;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.repositories.operations.PurchaseRepository;
import com.storecontrol.backend.repositories.operations.RechargeRepository;
import com.storecontrol.backend.repositories.operations.TradeRepository;
import com.storecontrol.backend.services.customers.CustomerService;
import com.storecontrol.backend.services.operations.ItemService;
import com.storecontrol.backend.services.operations.validation.PurchaseValidation;
import com.storecontrol.backend.services.registers.RegisterService;
import com.storecontrol.backend.services.stands.ProductService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor 
public class SalesTradeRegister {

  private final PurchaseValidation purchaseValidation;
  private final TradeRepository repository;
  private final RechargeRepository rechargeRepository;
  private final PurchaseRepository purchaseRepository;
  private final ProductService productService;
  private final CustomerService customerService;
  private final RegisterService registerService;
  private final ItemService itemService;

  @Transactional 
  public TradeView createTradeFromBankApp(ExternalSaleDTO externalSale) {
    Voluntary voluntary = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    Map<UUID, Product> productMap = productService.listAllProductsAsMap();

    var register = registerService.safeTakeRegisterByStandUuid(purchaseRequest.standUuid());

    var customer = customerService.initializeCustomer(rechargeRequest.cardId());

    var recharge = new Recharge(rechargeRequest, customer, register, voluntary);
    handleCashTotal(recharge, recharge.getPaymentTypeEnum(), false);

    rechargeRepository.save(recharge);

    boolean hasReverseQuantity = purchaseRequest.items().stream()
        .anyMatch(item -> item.quantity() < 0);
    var purchase = new Purchase(false, purchaseRequest.standUuid(), customer, voluntary, hasReverseQuantity);
    var items = itemService.createItems(purchaseRequest, purchase, purchaseRequest.standUuid());
    purchase.setItems(items);

    updateItemsFromItemsChanged(purchase, productMap, false);

    purchaseRepository.save(purchase);

    customerService.finalizeCustomer(customer, false);

    Trade trade = new Trade(recharge.getUuid(), purchase.getUuid());

    repository.save(trade);

    return new TradeView(trade, recharge, purchase);
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
}

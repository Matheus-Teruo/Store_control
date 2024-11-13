package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.good.RequestUpdateGood;
import com.storecontrol.backend.controllers.request.item.RequestUpdateItem;
import com.storecontrol.backend.controllers.request.orderCard.RequestUpdateOrderCard;
import com.storecontrol.backend.controllers.request.sale.RequestSale;
import com.storecontrol.backend.controllers.request.sale.RequestUpdateSale;
import com.storecontrol.backend.models.Good;
import com.storecontrol.backend.models.Sale;
import com.storecontrol.backend.repositories.SaleRepository;
import com.storecontrol.backend.services.validation.SaleValidate;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SaleService {

  @Autowired
  SaleRepository repository;

  @Autowired
  SaleValidate validate;

  @Autowired
  VoluntaryService voluntaryService;

  @Autowired
  CustomerService customerService;

  @Autowired
  GoodService goodService;

  @Transactional
  public Sale createSale(RequestSale request) {
    var voluntary = voluntaryService.takeVoluntary(request.voluntaryId());
    var customer = customerService.takeActiveCustomerByCardId(request.orderCardId());

    validate.checkInsufficientCreditValidity(request, customer);
    validate.checkInsufficientStockItemValidity(request);

    var sale =  new Sale(request, customer,  voluntary);

    var goods = goodService.createGoods(request, sale);
    sale.updateSale(goods);

    updateItemsFromGoods(sale);
    updateCustomerDebit(sale);
    repository.save(sale);

    return sale;
  }

  public Sale takeSale(String uuid) {
    return repository.findByIdValidTrue(UUID.fromString(uuid));
  }

  public List<Sale> listSales() {
    return repository.findAllByValidTrue();
  }

  @Transactional
  public Sale updateSale(RequestUpdateSale request) {
    Optional<Sale> saleOptional = repository.findById(UUID.fromString(request.uuid()));

    if (saleOptional.isPresent()) {
      var sale = saleOptional.get();
      sale.updateSale(request);

      updateGoodsFromSale(request, sale);

      return sale;
    } else {
      return new Sale();
    }
  }

  @Transactional
  public void deleteSale(RequestUpdateSale request) {
    Optional<Sale> saleOptional = repository.findById(UUID.fromString(request.uuid()));

    if (saleOptional.isPresent()) {
      var sale = saleOptional.get();

      validate.checkSomeGoodWasDelivered(sale);

      revertUpdateItemsFromGoods(sale);
      revertUpdateCustomerDebit(sale);
      sale.deleteSale();
    }

  }

  private void updateItemsFromGoods(Sale sale) {
    for (Good good : sale.getGoods()) {
      var item = good.getGoodId().getItem();
      item.updateItem(new RequestUpdateItem(
          item.getUuid().toString(),
          null,
          null,
          item.getStock() - good.getQuantity(),
          null,
          null));
    }
  }

  private void revertUpdateItemsFromGoods(Sale sale) {
    for (Good good : sale.getGoods()) {
      var item = good.getGoodId().getItem();
      item.updateItem(new RequestUpdateItem(
          item.getUuid().toString(),
          null,
          null,
          item.getStock() + good.getQuantity(),
          null,
          null));
    }
  }

  private void updateCustomerDebit(Sale sale) {
    var totalValue = sale.getGoods().stream().map(good ->
            BigDecimal.valueOf(good.getQuantity())
                .multiply(good.getUnitPrice()))
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    var orderCard = sale.getCustomer().getOrderCard();
    var debitResult = orderCard.getDebit().subtract(totalValue);

    var requestUpdateOrderCard = new RequestUpdateOrderCard(
        orderCard.getId(),
        debitResult.toString(),
        null);

    orderCard.updateOrderCard(requestUpdateOrderCard);
  }

  private void revertUpdateCustomerDebit(Sale sale) {
    var totalValue = sale.getGoods().stream().map(good ->
            BigDecimal.valueOf(good.getQuantity())
                .multiply(good.getUnitPrice()))
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    var orderCard = sale.getCustomer().getOrderCard();
    var debitResult = orderCard.getDebit().add(totalValue);

    var requestUpdateOrderCard = new RequestUpdateOrderCard(
        orderCard.getId(),
        debitResult.toString(),
        null);

    orderCard.updateOrderCard(requestUpdateOrderCard);
  }

  private void updateGoodsFromSale(RequestUpdateSale request, Sale sale) {
    if (request.uuid() != null) {
      var goods = goodService.takeGoodsBySaleId(request.uuid());

      for (RequestUpdateGood requestUpdateGood : request.requestUpdateGoods()) {
        for (Good good : goods) {
          if (good.getGoodId().getItem().getUuid().toString().equals(requestUpdateGood.itemId())) {
            good.updateGood(requestUpdateGood);
            // Note: that way minimize calls from database. // search for better solution
          }
        }
      }

      sale.updateSale(goods);
    }
  }
}

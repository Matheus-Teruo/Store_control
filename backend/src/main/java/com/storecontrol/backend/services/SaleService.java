package com.storecontrol.backend.services;

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
    var voluntary = voluntaryService.takeVoluntaryByUuid(request.voluntaryId());
    var customer = customerService.takeActiveCustomerByCardId(request.orderCardId());

    validate.checkInsufficientCreditValidity(request, customer);
    validate.checkInsufficientStockItemValidity(request);

    var sale =  new Sale(request, customer,  voluntary);

    var goods = goodService.createGoods(request, sale);
    sale.allocateGoodsToSale(goods);

    updateItemsFromGoodsChanged(sale, false);
    updateCustomerDebit(sale, false);
    repository.save(sale);

    return sale;
  }

  public Sale takeSaleByUuid(String uuid) {
    var saleOptional = repository.findByUuidValidTrue(UUID.fromString(uuid));

    return saleOptional.orElseGet(Sale::new);  // TODO: ERROR: sale_uuid invalid
  }

  public List<Sale> listSales() {
    return repository.findAllValidTrue();
  }

  @Transactional
  public Sale updateSale(RequestUpdateSale request) {
    var sale = takeSaleByUuid(request.uuid());

    sale.updateSale(request);
    sale.updateGoodsFromSale(request.requestUpdateGoods());

    return sale;
  }

  @Transactional
  public void deleteSale(RequestUpdateSale request) {
    var sale = takeSaleByUuid(request.uuid());

    validate.checkSomeGoodWasDelivered(sale);

    updateItemsFromGoodsChanged(sale, true);
    updateCustomerDebit(sale, true);

    sale.deleteSale();
  }

  private void updateItemsFromGoodsChanged(Sale sale, Boolean isReversal) {
    for (Good good : sale.getGoods()) {
      var item = good.getGoodId().getItem();
      int adjustmentFactor = isReversal ? 1 : -1;

      item.updateItem(new RequestUpdateItem(
          item.getUuid().toString(),
          null,
          null,
          item.getStock() + (adjustmentFactor * good.getQuantity()),
          null,
          null));
    }
  }

  private void updateCustomerDebit(Sale sale, Boolean isReversal) {
    var totalValue = sale.getGoods().stream().map(good ->
            BigDecimal.valueOf(good.getQuantity())
                .multiply(good.getUnitPrice()))
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    var orderCard = sale.getCustomer().getOrderCard();

    BigDecimal adjustmentFactor = isReversal ? BigDecimal.ONE : BigDecimal.valueOf(-1);

    var debitResult = orderCard.getDebit().add(totalValue.multiply(adjustmentFactor));

    var requestUpdateOrderCard = new RequestUpdateOrderCard(
        orderCard.getId(),
        debitResult.toString(),
        null);

    orderCard.updateOrderCard(requestUpdateOrderCard);
  }
}

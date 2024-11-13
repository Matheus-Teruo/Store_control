package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.good.RequestGood;
import com.storecontrol.backend.controllers.request.sale.RequestSale;
import com.storecontrol.backend.models.Good;
import com.storecontrol.backend.models.GoodID;
import com.storecontrol.backend.models.Sale;
import com.storecontrol.backend.repositories.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class GoodService {

  @Autowired
  SaleRepository repository;

  @Autowired
  ItemService itemService;

  public List<Good> createGoods(RequestSale request, Sale sale) {
    List<Good> goods = new ArrayList<>();

    for (RequestGood requestGood : request.requestGoods()) {
      var item = itemService.takeItem(requestGood.itemId());
      goods.add(new Good(requestGood, new GoodID(item, sale)));
    }

    return goods;
  }

  public List<Good> takeGoodsBySaleId(String saleUuid) {
    return repository.findAllGoodsFromOneSale(UUID.fromString(saleUuid));
  }
}

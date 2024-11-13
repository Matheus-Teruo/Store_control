package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.good.RequestGood;
import com.storecontrol.backend.controllers.request.purchase.RequestPurchase;
import com.storecontrol.backend.models.Good;
import com.storecontrol.backend.models.GoodID;
import com.storecontrol.backend.models.Purchase;
import com.storecontrol.backend.repositories.PurchaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GoodService {

  @Autowired
  PurchaseRepository repository;

  @Autowired
  ItemService itemService;

  public List<Good> createGoods(RequestPurchase request, Purchase purchase) {
    List<Good> goods = new ArrayList<>();

    for (RequestGood requestGood : request.requestGoods()) {
      var item = itemService.takeItemByUuid(requestGood.itemId());
      goods.add(new Good(requestGood, new GoodID(item, purchase)));
    }

    return goods;
  }
}

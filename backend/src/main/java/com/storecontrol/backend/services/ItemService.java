package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.purchase.RequestPurchase;
import com.storecontrol.backend.controllers.request.item.RequestItem;
import com.storecontrol.backend.models.Item;
import com.storecontrol.backend.models.Purchase;
import com.storecontrol.backend.models.ItemId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ItemService {

  @Autowired
  ProductService productService;

  public List<Item> createItems(RequestPurchase request, Purchase purchase) {
    List<Item> items = new ArrayList<>();

    for (RequestItem requestItem : request.requestItems()) {
      var item = productService.takeProductByUuid(requestItem.productId());
      items.add(new Item(requestItem, new ItemId(item, purchase)));
    }

    return items;
  }
}

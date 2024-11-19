package com.storecontrol.backend.services.operations;

import com.storecontrol.backend.controllers.operations.request.RequestPurchase;
import com.storecontrol.backend.controllers.operations.request.RequestItem;
import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.purchases.ItemId;
import com.storecontrol.backend.services.stands.ProductService;
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

    for (RequestItem requestItem : request.items()) {
      var item = productService.takeProductByUuid(requestItem.productId());
      items.add(new Item(requestItem, new ItemId(item, purchase)));
    }

    return items;
  }
}

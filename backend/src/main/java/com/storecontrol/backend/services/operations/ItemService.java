package com.storecontrol.backend.services.operations;

import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.operations.purchases.ItemId;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreateItem;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.services.stands.ProductService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ItemService {

  @Autowired
  ProductService productService;

  @Transactional
  public List<Item> createItems(RequestCreatePurchase request, Purchase purchase) {
    List<Item> items = new ArrayList<>();

    for (RequestCreateItem requestCreateItem : request.items()) {
      var product = productService.safeTakeProductByUuid(requestCreateItem.productId());
      var itemId = new ItemId(product, purchase);
      var item = new Item(requestCreateItem, itemId);
      items.add(item);
    }

    return items;
  }
}

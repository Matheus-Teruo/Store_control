package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.purchase.RequestPurchase;
import com.storecontrol.backend.controllers.request.purchaseItem.RequestPurchaseItem;
import com.storecontrol.backend.models.Purchase;
import com.storecontrol.backend.models.PurchaseItem;
import com.storecontrol.backend.models.PurchaseItemId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PurchaseItemService {

  @Autowired
  ItemService itemService;

  public List<PurchaseItem> createPurchaseItems(RequestPurchase request, Purchase purchase) {
    List<PurchaseItem> purchaseItems = new ArrayList<>();

    for (RequestPurchaseItem requestPurchaseItem : request.requestPurchaseItems()) {
      var item = itemService.takeItemByUuid(requestPurchaseItem.itemId());
      purchaseItems.add(new PurchaseItem(requestPurchaseItem, new PurchaseItemId(item, purchase)));
    }

    return purchaseItems;
  }
}

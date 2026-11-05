package com.storecontrol.backend.services.operations;

import com.storecontrol.backend.models.integration.response.ExternalOrderDTO.ItemDTO;
import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.operations.purchases.ItemId;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreateItem;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.stands.products.Product;
import com.storecontrol.backend.repositories.operations.PurchaseRepository;
import com.storecontrol.backend.services.stands.ProductService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemService {

  private final ProductService productService;
  private final PurchaseRepository repository;

  @Transactional
  public List<Item> createItems(RequestCreatePurchase request, Purchase purchase, UUID standUuid) {
    List<Item> items = new ArrayList<>();

    var productMap = productService.listProductsAsMap(standUuid);

    for (RequestCreateItem requestCreateItem : request.items()) {
      var product = productMap.get(requestCreateItem.productUuid());

      var itemId = new ItemId(product, purchase);
      var item = new Item(requestCreateItem, itemId);
      items.add(item);
    }

    return items;
  }

  @Transactional
  public List<Item> createItems(List<ItemDTO> itemDTOs, Purchase purchase, Map<String, Product> productMapExternalKey) {
    List<Item> items = new ArrayList<>();

    for (ItemDTO itemDto : itemDTOs) {
      var product = productMapExternalKey.get(itemDto.externalProductId());

      var itemId = new ItemId(product, purchase);
      var item = new Item(itemDto, itemId);
      items.add(item);
    }

    return items;
  }

  public List<Item> listItems(UUID purchaseUuid) {
    return repository.findByPurchaseUuid(purchaseUuid);
  }

  public Map<UUID, List<Item>> listItemsFromMultiPurchase(List<UUID> purchasesUuid) {
    var items = repository.findByPurchasesUuid(purchasesUuid);

    return items.stream()
        .collect(Collectors.groupingBy(item -> item.getItemId().getPurchase().getUuid()));
  }
}

package com.storecontrol.backend.services.stands;

import com.storecontrol.backend.models.stands.products.Product;
import com.storecontrol.backend.models.stands.products.ProductCombo;
import com.storecontrol.backend.models.stands.products.ProductComboId;
import com.storecontrol.backend.models.stands.products.request.RequestCreateProductCombo;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductComboService {

  @Transactional
  public List<ProductCombo> createCombo(
      List<RequestCreateProductCombo> requestProductCombos,
      Product product,
      Map<UUID, Product> productMap
  ) {
    List<ProductCombo> productCombos = new ArrayList<>();

    for (RequestCreateProductCombo requestCreateProductCombo : requestProductCombos) {
      var includedProduct = productMap.get(requestCreateProductCombo.includedProductUuid());

      var productComboId = new ProductComboId(product, includedProduct);
      var productCombo = new ProductCombo(requestCreateProductCombo, productComboId);
      productCombos.add(productCombo);
    }

    return productCombos;
  }

  @Transactional
  public List<ProductCombo> updateCombo(
      List<RequestCreateProductCombo> requestProductCombos,
      Product product,
      Map<UUID, Product> productMap
  ) {
    Map<UUID, ProductCombo> existingComboMap = product.getComboProducts()
        .stream()
        .collect(Collectors.toMap(ProductCombo::getProductIncludedUuid, productCombo -> productCombo));

    List<ProductCombo> newProductCombos = new ArrayList<>();

    for (RequestCreateProductCombo requestCreateProductCombo : requestProductCombos) {
      UUID productUuid = requestCreateProductCombo.includedProductUuid();

      if (existingComboMap.containsKey(productUuid)) {
        ProductCombo existing = existingComboMap.get(productUuid);
        existing.setQuantity(requestCreateProductCombo.quantity());
        newProductCombos.add(existing);
      } else {
        var newProductComboId = new ProductComboId(product, productMap.get(productUuid));
        ProductCombo newProductCombo = new ProductCombo(
            requestCreateProductCombo,
            newProductComboId
        );
        newProductCombos.add(newProductCombo);
      }
    }

    return newProductCombos;
  }
}

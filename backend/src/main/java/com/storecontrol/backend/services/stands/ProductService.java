package com.storecontrol.backend.services.stands;

import com.storecontrol.backend.controllers.stands.request.RequestProduct;
import com.storecontrol.backend.controllers.stands.request.RequestUpdateProduct;
import com.storecontrol.backend.models.stands.Product;
import com.storecontrol.backend.repositories.stands.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

  @Autowired
  ProductRepository repository;

  @Autowired
  StandService standService;

  @Transactional
  public Product createProduct(RequestProduct request) {
    var stand = standService.takeStandByUuid(request.standId());
    var product = new Product(request, stand);
    repository.save(product);

    return product;
  }

  public Product takeProductByUuid(String uuid) {
    var itemOptional = repository.findByUuidValidTrue(UUID.fromString(uuid));

    return itemOptional.orElseGet(Product::new);  // TODO: ERROR: item_uuid invalid
  }

  public List<Product> listProducts() {
    return repository.findAllValidTrue();
  }

  @Transactional
  public Product updateProduct(RequestUpdateProduct request) {
    var product = takeProductByUuid(request.uuid());

    product.updateProduct(request);
    updateStandFromProduct(request.standId(), product);

    return product;
  }

  @Transactional
  public void deleteProduct(RequestUpdateProduct request) {
    var product = takeProductByUuid(request.uuid());

    product.deleteProduct();
  }

  private void updateStandFromProduct(String uuid, Product product) {
    if (uuid != null) {
      var stand = standService.takeStandByUuid(uuid);

      product.updateProduct(stand);
    }
  }
}

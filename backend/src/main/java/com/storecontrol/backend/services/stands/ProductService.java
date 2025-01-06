package com.storecontrol.backend.services.stands;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.stands.Product;
import com.storecontrol.backend.models.stands.request.RequestCreateProduct;
import com.storecontrol.backend.models.stands.request.RequestUpdateProduct;
import com.storecontrol.backend.repositories.stands.ProductRepository;
import com.storecontrol.backend.services.stands.validation.ProductValidation;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {

  @Autowired
  ProductValidation validation;

  @Autowired
  ProductRepository repository;

  @Autowired
  StandService standService;

  @Transactional
  public Product createProduct(RequestCreateProduct request) {
    validation.checkNameDuplication(request.productName());
    var stand = standService.safeTakeStandByUuid(request.standUuid());
    var product = new Product(request, stand);
    repository.save(product);

    return product;
  }

  public Product takeProductByUuid(UUID uuid) {
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(EntityNotFoundException::new);
  }

  public Product safeTakeProductByUuid(UUID uuid) {
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(() -> new InvalidDatabaseQueryException(
            MessageResolver.getInstance().getMessage("service.exception.product.get.validation.error"),
            MessageResolver.getInstance().getMessage("service.exception.product.get.validation.message"),
            uuid.toString())
        );
  }

  public List<Product> listProducts() {
    return repository.findAllValidTrue();
  }

  public Map<UUID, Product> listProductsAsMap() {
    List<Product> products = repository.findAllValidTrue();
    return products.stream()
        .collect(Collectors.toMap(Product::getUuid, product -> product));
  }

  @Transactional
  public Product updateProduct(RequestUpdateProduct request) {
    validation.checkNameDuplication(request.productName());
    var product = safeTakeProductByUuid(request.uuid());

    product.updateProduct(request);
    updateStandFromProduct(request.standUuid(), product);

    return product;
  }

  @Transactional
  public void deleteProduct(UUID uuid) {
    var product = safeTakeProductByUuid(uuid);

    product.deleteProduct();
  }

  private void updateStandFromProduct(UUID uuid, Product product) {
    if (uuid != null) {
      var stand = standService.safeTakeStandByUuid(uuid);

      product.updateProduct(stand);
    }
  }
}

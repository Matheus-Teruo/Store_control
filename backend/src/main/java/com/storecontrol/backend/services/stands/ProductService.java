package com.storecontrol.backend.services.stands;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.stands.products.Product;
import com.storecontrol.backend.models.stands.products.Tag;
import com.storecontrol.backend.models.stands.products.request.RequestCreateProduct;
import com.storecontrol.backend.models.stands.products.request.RequestUpdateProduct;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.repositories.stands.ProductRepository;
import com.storecontrol.backend.services.stands.validation.ProductValidation;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {

  @Autowired
  private ProductValidation validation;

  @Autowired
  private ProductRepository repository;

  @Autowired
  private StandService standService;

  @Autowired
  private TagService tagService;

  @Transactional
  public Product createProduct(RequestCreateProduct request) {
    Voluntary manager = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    validation.checkNameDuplication(request.productName());
    validation.checkProductBelongsManagerStand(request.standUuid(), manager);
    var stand = standService.safeTakeStandByUuid(request.standUuid());
    var product = new Product(request, stand);

    if (!request.tagsUuid().isEmpty()) {
      var tags = tagService.listSelectedTags(request.tagsUuid());
      product.createTags(tags);
    }

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

  public Page<Product> pageProducts(String productName, UUID tagUuid, UUID standUuid, Pageable pageable) {
    return repository.findAllValidTruePage(productName, tagUuid, standUuid, pageable);
  }

  public List<Product> listProducts(UUID standUuid) {
    return repository.findAllValidTrueByStandUuid(standUuid);
  }

  public Map<UUID, Product> listProductsAsMap(UUID standUuid) {
    List<Product> products = repository.findAllValidTrueByStandUuid(standUuid);
    return products.stream()
        .collect(Collectors.toMap(Product::getUuid, product -> product));
  }

  @Transactional
  public Product updateProduct(RequestUpdateProduct request) {
    Voluntary manager = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    validation.checkNameDuplication(request.productName());
    validation.checkProductBelongsManagerStand(request.standUuid(), manager);
    var product = safeTakeProductByUuid(request.uuid());

    if (request.tagsUuid() != null) {
      List<Tag> newTags = tagService.listSelectedTags(request.tagsUuid());
      product.updateTags(request.tagsUuid(), newTags);
    }

    product.updateProduct(request);
    updateStandFromProduct(request.standUuid(), product);

    return product;
  }

  @Transactional
  public void deleteProduct(UUID uuid) {
    Voluntary manager = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    var product = safeTakeProductByUuid(uuid);
    validation.checkProductBelongsManagerStand(product.getStandUuid(), manager);

    product.deleteProduct();
  }

  private void updateStandFromProduct(UUID uuid, Product product) {
    if (uuid != null) {
      var stand = standService.safeTakeStandByUuid(uuid);

      product.updateProduct(stand);
    }
  }
}

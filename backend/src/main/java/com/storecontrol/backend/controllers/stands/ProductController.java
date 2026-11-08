package com.storecontrol.backend.controllers.stands;

import com.storecontrol.backend.models.stands.products.Product;
import com.storecontrol.backend.models.stands.products.request.RequestCreateProduct;
import com.storecontrol.backend.models.stands.products.request.RequestUpdateProduct;
import com.storecontrol.backend.models.stands.products.response.ResponseProduct;
import com.storecontrol.backend.models.stands.products.response.ResponseSummaryProduct;
import com.storecontrol.backend.models.stands.products.response.UploadResponse;
import com.storecontrol.backend.services.stands.ProductService;
import com.storecontrol.backend.services.stands.StorageService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("products")
@RequiredArgsConstructor
public class ProductController {

  private final ProductService service;
  private final StorageService storageService;

  @PostMapping
  public ResponseEntity<ResponseProduct> createProduct(
      @RequestBody @Valid RequestCreateProduct request) {
    var product = service.createProduct(request);

    URI location = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .path("/{uuid}")
        .buildAndExpand(product.getUuid())
        .toUri();

    return ResponseEntity.created(location).body(new ResponseProduct(product, storageService.generatePublicUrl(product.getProductImgKey())));
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseProduct> readProduct(@PathVariable @Valid UUID uuid) {
    Product product = service.takeProductByUuid(uuid);
    var response = new ResponseProduct(product, storageService.generatePublicUrl(product.getProductImgKey()));
    return ResponseEntity.ok(response);
  }

  @GetMapping()
  public ResponseEntity<Page<ResponseSummaryProduct>> readProducts(
      @RequestParam(required = false) String productName,
      @RequestParam(required = false) UUID tagUuid,
      @RequestParam(required = false) UUID standUuid,
      Pageable pageable) {
    var products = service.pageProducts(productName, tagUuid, standUuid, pageable);

    var response = products.map(product -> new ResponseSummaryProduct(product, storageService.generatePublicUrl(product.getProductImgKey())));
    return ResponseEntity.ok(response);
  }

  @GetMapping("/list/{standUuid}")
  public ResponseEntity<List<ResponseSummaryProduct>> readListProducts(@PathVariable @Valid UUID standUuid) {
    var products = service.listProducts(standUuid);

    var response = products.stream().map(product -> new ResponseSummaryProduct(product, storageService.generatePublicUrl(product.getProductImgKey()))).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponseProduct> updateProduct(@RequestBody @Valid RequestUpdateProduct request) {
    Product product = service.updateProduct(request);
    var response = new ResponseProduct(product, storageService.generatePublicUrl(product.getProductImgKey()));

    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{uuid}")
  public ResponseEntity<Void> deleteProduct(@PathVariable @Valid UUID uuid) {
    service.deleteProduct(uuid);

    return ResponseEntity.noContent().build();
  }

  @PostMapping("/upload-image/{uuid}")
  public ResponseEntity<UploadResponse> uploadImage(
    @RequestParam("image") MultipartFile image,
    @PathVariable UUID uuid
  ) throws IOException {
    return ResponseEntity.ok(new UploadResponse(service.uploadImage(image, uuid)));
  }
}

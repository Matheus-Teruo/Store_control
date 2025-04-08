package com.storecontrol.backend.controllers.stands;

import com.storecontrol.backend.models.stands.products.request.RequestCreateProduct;
import com.storecontrol.backend.models.stands.products.request.RequestUpdateProduct;
import com.storecontrol.backend.models.stands.products.response.ResponseProduct;
import com.storecontrol.backend.models.stands.products.response.ResponseSummaryProduct;
import com.storecontrol.backend.services.stands.GCSService;
import com.storecontrol.backend.services.stands.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("products")
public class ProductController {

  @Autowired
  private ProductService service;

  @Autowired
  private GCSService GCSService;

  @PostMapping
  public ResponseEntity<ResponseProduct> createProduct(
      @RequestBody @Valid RequestCreateProduct request) {
    var product = service.createProduct(request);

    URI location = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .path("/{uuid}")
        .buildAndExpand(product.getUuid())
        .toUri();

    return ResponseEntity.created(location).body(new ResponseProduct(product));
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseProduct> readProduct(@PathVariable @Valid UUID uuid) {
    var response = new ResponseProduct(service.takeProductByUuid(uuid));
    return ResponseEntity.ok(response);
  }

  @GetMapping()
  public ResponseEntity<Page<ResponseSummaryProduct>> readProducts(
      @RequestParam(required = false) String productName,
      @RequestParam(required = false) UUID tagUuid,
      @RequestParam(required = false) UUID standUuid,
      Pageable pageable) {
    var products = service.pageProducts(productName, tagUuid, standUuid, pageable);

    var response = products.map(ResponseSummaryProduct::new);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/list/{standUuid}")
  public ResponseEntity<List<ResponseSummaryProduct>> readListProducts(@PathVariable @Valid UUID standUuid) {
    var products = service.listProducts(standUuid);

    var response = products.stream().map(ResponseSummaryProduct::new).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponseProduct> updateProduct(@RequestBody @Valid RequestUpdateProduct request) {
    var response = new ResponseProduct(service.updateProduct(request));

    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{uuid}")
  public ResponseEntity<Void> deleteProduct(@PathVariable @Valid UUID uuid) {
    service.deleteProduct(uuid);

    return ResponseEntity.noContent().build();
  }

  @PostMapping("/upload-image")
  public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("image") MultipartFile image) throws IOException {
    var tempFile = GCSService.adjustNameFile(image);
    image.transferTo(tempFile);

    String url = GCSService.uploadFile(tempFile, tempFile.getName());

    return ResponseEntity.ok(Map.of("url", url));
  }
}

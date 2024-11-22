package com.storecontrol.backend.controllers.stands;

import com.storecontrol.backend.models.stands.request.RequestCreateProduct;
import com.storecontrol.backend.models.stands.request.RequestUpdateProduct;
import com.storecontrol.backend.models.stands.response.ResponseProduct;
import com.storecontrol.backend.models.stands.response.ResponseSummaryProduct;
import com.storecontrol.backend.services.stands.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("products")
public class ProductController {

  @Autowired
  ProductService service;

  @PostMapping
  public ResponseEntity<ResponseProduct> createProduct(@RequestBody @Valid RequestCreateProduct request) {
    var response = new ResponseProduct(service.createProduct(request));

    return ResponseEntity.ok(response);
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<ResponseProduct> readProduct(@PathVariable UUID uuid) {
    var response = new ResponseProduct(service.takeProductByUuid(uuid));
    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseSummaryProduct>> readProducts() {
    var items = service.listProducts();

    var response = items.stream().map(ResponseSummaryProduct::new).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponseProduct> updateProduct(@RequestBody @Valid RequestUpdateProduct request) {
    var response = new ResponseProduct(service.updateProduct(request));

    return ResponseEntity.ok(response);
  }

  @DeleteMapping
  public ResponseEntity<Void> deleteProduct(@RequestBody @Valid RequestUpdateProduct request) {
    service.deleteProduct(request);

    return ResponseEntity.noContent().build();
  }
}

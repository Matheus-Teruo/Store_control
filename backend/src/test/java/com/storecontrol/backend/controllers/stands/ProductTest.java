package com.storecontrol.backend.controllers.stands;

import com.storecontrol.backend.BaseTest;
import com.storecontrol.backend.models.stands.Product;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.stands.request.RequestCreateProduct;
import com.storecontrol.backend.models.stands.request.RequestUpdateProduct;
import com.storecontrol.backend.models.stands.response.ResponseProduct;
import com.storecontrol.backend.models.stands.response.ResponseSummaryProduct;
import com.storecontrol.backend.services.stands.ProductService;
import com.storecontrol.backend.services.stands.S3Service;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ProductTest extends BaseTest {

  @MockBean
  private ProductService service;

  @MockBean
  private S3Service s3Service;

  @Test
  void testCreateProductSuccess() throws Exception {
    // Given
    Product mockProduct = createProductEntity(UUID.randomUUID());
    RequestCreateProduct requestProduct = createRequestCreateProduct(mockProduct);
    ResponseProduct expectedResponse = new ResponseProduct(mockProduct);

    when(service.createProduct(requestProduct)).thenReturn(mockProduct);

    // When & Then
    mockMvc.perform(post("/products")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(requestProduct)))
        .andExpect(status().isCreated())
        .andExpect(header().string("Location",
            containsString("/products/" + mockProduct.getUuid().toString())))
        .andExpect(content().json(toJson(expectedResponse)));


    // Verify interactions
    verify(service, times(1)).createProduct(requestProduct);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadProductSuccess() throws Exception {
    // Given
    UUID productUuid = UUID.randomUUID();

    Product mockProduct = createProductEntity(productUuid);
    ResponseProduct expectedResponse = new ResponseProduct(mockProduct);

    when(service.takeProductByUuid(productUuid)).thenReturn(mockProduct);

    // When & Then
    mockMvc.perform(get("/products/{uuid}", productUuid)
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).takeProductByUuid(productUuid);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadProductsSuccess() throws Exception {
    // Given
    List<Product> mockProducts = List.of(
        createProductEntity(UUID.randomUUID()),
        createProductEntity(UUID.randomUUID())
    );
    Page<Product> mockPage = new PageImpl<>(mockProducts);
    Page<ResponseSummaryProduct> expectedResponse = mockPage
        .map(ResponseSummaryProduct::new);

    when(service.pageProducts(any(String.class), any(UUID.class), any(Pageable.class))).thenReturn(mockPage);

    // When & Then
    mockMvc.perform(get("/products?productName=&standUuid=550e8400-e29b-41d4-a716-446655440000")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).pageProducts(any(String.class),  any(UUID.class), any(Pageable.class));
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadListProductsSuccess() throws Exception {
    // Given
    List<Product> mockProducts = List.of(
        createProductEntity(UUID.randomUUID()),
        createProductEntity(UUID.randomUUID())
    );
    List<ResponseSummaryProduct> expectedResponse = mockProducts.stream()
        .map(ResponseSummaryProduct::new)
        .toList();

    when(service.listProducts()).thenReturn(mockProducts);

    // When & Then
    mockMvc.perform(get("/products/list")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).listProducts();
    verifyNoMoreInteractions(service);
  }

  @Test
  void testUpdateProductSuccess() throws Exception {
    // Given
    Product mockProduct = createProductEntity(UUID.randomUUID());

    Stand updatedMockStand = createStandEntity(UUID.randomUUID());
    RequestUpdateProduct updateRequest = createRequestUpdateProduct(mockProduct.getUuid(), updatedMockStand.getUuid());

    mockProduct.updateProduct(updateRequest);
    mockProduct.updateProduct(updatedMockStand);
    ResponseProduct expectedResponse = new ResponseProduct(mockProduct);

    when(service.updateProduct(updateRequest)).thenReturn(mockProduct);

    // When & Then
    mockMvc.perform(put("/products")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(updateRequest)))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).updateProduct(updateRequest);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testDeleteProductSuccess() throws Exception {
    // Given
    UUID productUuid =  UUID.randomUUID();

    doNothing().when(service).deleteProduct(productUuid);

    // When & Then
    mockMvc.perform(delete("/products/{uuid}", productUuid)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNoContent());

    // Verify interactions
    verify(service, times(1)).deleteProduct(productUuid);
    verifyNoMoreInteractions(service);
  }

  @Test
  void contextLoads() {
    assertNotNull(s3Service, "S3Service should be mocked and not null.");
  }
}
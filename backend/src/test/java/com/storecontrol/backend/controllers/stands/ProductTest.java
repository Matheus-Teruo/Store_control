package com.storecontrol.backend.controllers.stands;

import com.storecontrol.backend.BaseTest;
import com.storecontrol.backend.models.stands.Product;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.stands.request.RequestCreateProduct;
import com.storecontrol.backend.models.stands.request.RequestUpdateProduct;
import com.storecontrol.backend.models.stands.response.ResponseProduct;
import com.storecontrol.backend.models.stands.response.ResponseSummaryProduct;
import com.storecontrol.backend.services.stands.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ProductTest extends BaseTest {

  @MockBean
  private ProductService service;

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
    List<ResponseSummaryProduct> expectedResponse = mockProducts.stream()
        .map(ResponseSummaryProduct::new)
        .toList();

    when(service.listProducts()).thenReturn(mockProducts);

    // When & Then
    mockMvc.perform(get("/products")
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
    RequestUpdateProduct deleteRequest = createRequestUpdateProduct(UUID.randomUUID(), UUID.randomUUID());

    doNothing().when(service).deleteProduct(deleteRequest);

    // When & Then
    mockMvc.perform(delete("/products")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(deleteRequest)))
        .andExpect(status().isNoContent());

    // Verify interactions
    verify(service, times(1)).deleteProduct(deleteRequest);
    verifyNoMoreInteractions(service);
  }
}
package com.storecontrol.backend.controllers.stands;

import com.storecontrol.backend.BaseControllerTest;
import com.storecontrol.backend.models.stands.Product;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.stands.request.RequestCreateProduct;
import com.storecontrol.backend.models.stands.request.RequestUpdateProduct;
import com.storecontrol.backend.models.stands.response.ResponseProduct;
import com.storecontrol.backend.models.stands.response.ResponseSummaryProduct;
import com.storecontrol.backend.services.stands.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

class ProductControllerTest extends BaseControllerTest {

  @MockBean
  private ProductService service;

  @Test
  void testCreateProductSuccess() throws Exception {
    // Given
    Product mockProduct = createProductEntity(UUID.randomUUID());
    RequestCreateProduct requestProduct = createRequestCreateProduct(mockProduct);
    ResponseProduct expectedResponse = new ResponseProduct(mockProduct);

    when(service.createProduct(requestProduct)).thenReturn(mockProduct);

    // When
    String jsonResponse = performPostCreate("products", requestProduct, mockProduct.getUuid());

    // Then
    ResponseProduct actualResponse = fromJson(jsonResponse, ResponseProduct.class);
    assertEquals(expectedResponse, actualResponse);

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

    // When
    String jsonResponse = performGetWithVariablePath("products", productUuid);

    // Then
    ResponseProduct actualResponse = fromJson(jsonResponse, ResponseProduct.class);
    assertEquals(expectedResponse, actualResponse);

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

    // When
    String jsonResponse = performGetList("products")
        .andExpect(jsonPath("$.length()").value(2))
        .andReturn().getResponse().getContentAsString();

    // Then
    List<ResponseSummaryProduct> actualResponse = List.of(fromJson(jsonResponse, ResponseSummaryProduct[].class));
    assertEquals(expectedResponse, actualResponse);

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

    // When
    String jsonResponse = performPut("products", updateRequest);

    // Then
    ResponseProduct actualResponse = fromJson(jsonResponse, ResponseProduct.class);
    assertEquals(expectedResponse, actualResponse);

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
    performDelete("products", deleteRequest);

    // Verify interactions
    verify(service, times(1)).deleteProduct(deleteRequest);
    verifyNoMoreInteractions(service);
  }
}
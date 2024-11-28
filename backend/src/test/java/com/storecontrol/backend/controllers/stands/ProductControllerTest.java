package com.storecontrol.backend.controllers.stands;

import com.storecontrol.backend.BaseControllerTest;
import com.storecontrol.backend.models.stands.Association;
import com.storecontrol.backend.models.stands.Product;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.stands.request.RequestCreateProduct;
import com.storecontrol.backend.models.stands.request.RequestUpdateProduct;
import com.storecontrol.backend.services.stands.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ProductControllerTest extends BaseControllerTest {

  @MockBean
  private ProductService service;

  @Test
  void testCreateProduct() throws Exception {
    // Given
    Association mockAssociation = createAssociationEntity(UUID.randomUUID());
    Stand mockStand = createStandEntity(UUID.randomUUID(), mockAssociation);
    Product mockProduct = createProductEntity(UUID.randomUUID(), mockStand);

    RequestCreateProduct requestProduct = createRequestCreateProduct(mockStand.getUuid());

    when(service.createProduct(requestProduct)).thenReturn(mockProduct);

    // When & Then
    mockMvc.perform(post("/products")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(requestProduct)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.uuid").value(mockProduct.getUuid().toString()))
        .andExpect(jsonPath("$.productName").value(mockProduct.getProductName()))
        .andExpect(jsonPath("$.price").value(mockProduct.getPrice()))
        .andExpect(jsonPath("$.discount").value(mockProduct.getDiscount()))
        .andExpect(jsonPath("$.stock").value(mockProduct.getStock()))
        .andExpect(jsonPath("$.productImg").value(mockProduct.getProductImg()))
        .andExpect(jsonPath("$.stand.uuid").value(mockStand.getUuid().toString()))
        .andExpect(jsonPath("$.stand.stand").value(mockStand.getFunctionName()))
        .andExpect(jsonPath("$.stand.association.uuid").value(mockAssociation.getUuid().toString()))
        .andExpect(jsonPath("$.stand.association.association").value(mockAssociation.getAssociationName()))
        .andExpect(jsonPath("$.stand.association.principalName").value(mockAssociation.getPrincipalName()));

    // Verify interactions
    verify(service, times(1)).createProduct(requestProduct);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadProduct() throws Exception {
    // Given
    UUID productUuid = UUID.randomUUID();

    Association mockAssociation = createAssociationEntity(UUID.randomUUID());
    Stand mockStand = createStandEntity(UUID.randomUUID(), mockAssociation);
    Product mockProduct = createProductEntity(productUuid, mockStand);

    when(service.takeProductByUuid(productUuid)).thenReturn(mockProduct);

    // When & Then
    mockMvc.perform(get("/products/{uuid}", productUuid)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.uuid").value(mockProduct.getUuid().toString()))
        .andExpect(jsonPath("$.productName").value(mockProduct.getProductName()))
        .andExpect(jsonPath("$.price").value(mockProduct.getPrice()))
        .andExpect(jsonPath("$.discount").value(mockProduct.getDiscount()))
        .andExpect(jsonPath("$.stock").value(mockProduct.getStock()))
        .andExpect(jsonPath("$.productImg").value(mockProduct.getProductImg()))
        .andExpect(jsonPath("$.stand.uuid").value(mockStand.getUuid().toString()))
        .andExpect(jsonPath("$.stand.stand").value(mockStand.getFunctionName()))
        .andExpect(jsonPath("$.stand.association.uuid").value(mockAssociation.getUuid().toString()))
        .andExpect(jsonPath("$.stand.association.association").value(mockAssociation.getAssociationName()))
        .andExpect(jsonPath("$.stand.association.principalName").value(mockAssociation.getPrincipalName()));

    // Verify interactions
    verify(service, times(1)).takeProductByUuid(productUuid);
    verifyNoMoreInteractions(service);
  }

  @Test
  void readProducts() throws Exception {
    // Given
    Association mockAssociation = createAssociationEntity(UUID.randomUUID());
    Stand mockStand = createStandEntity(UUID.randomUUID(), mockAssociation);
    List<Product> mockProducts = List.of(
        createProductEntity(UUID.randomUUID(), mockStand),
        createProductEntity(UUID.randomUUID(), mockStand)
    );

    when(service.listProducts()).thenReturn(mockProducts);

    // When & Then
    mockMvc.perform(get("/products")
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(jsonPath("$[0].uuid").value(mockProducts.get(0).getUuid().toString()))
        .andExpect(jsonPath("$[0].productName").value(mockProducts.get(0).getProductName()))
        .andExpect(jsonPath("$[0].price").value(mockProducts.get(0).getPrice()))
        .andExpect(jsonPath("$[0].discount").value(mockProducts.get(0).getDiscount()))
        .andExpect(jsonPath("$[0].stock").value(mockProducts.get(0).getStock()))
        .andExpect(jsonPath("$[0].productImg").value(mockProducts.get(0).getProductImg()))
        .andExpect(jsonPath("$[0].standUuid").value(mockProducts.get(0).getStandUuid().toString()))
        .andExpect(jsonPath("$[1].uuid").value(mockProducts.get(1).getUuid().toString()))
        .andExpect(jsonPath("$[1].productName").value(mockProducts.get(1).getProductName()))
        .andExpect(jsonPath("$[1].price").value(mockProducts.get(1).getPrice()))
        .andExpect(jsonPath("$[1].discount").value(mockProducts.get(1).getDiscount()))
        .andExpect(jsonPath("$[1].stock").value(mockProducts.get(1).getStock()))
        .andExpect(jsonPath("$[1].productImg").value(mockProducts.get(1).getProductImg()))
        .andExpect(jsonPath("$[1].standUuid").value(mockProducts.get(1).getStandUuid().toString()));

    // Verify interactions
    verify(service, times(1)).listProducts();
    verifyNoMoreInteractions(service);
  }

  @Test
  void updateProduct() throws Exception {
    // Given
    Association mockAssociation = createAssociationEntity(UUID.randomUUID());
    Stand mockStand = createStandEntity(UUID.randomUUID(), mockAssociation);
    Product mockProduct = createProductEntity(UUID.randomUUID(), mockStand);

    Stand updatedMockStand = createStandEntity(UUID.randomUUID(), mockAssociation);
    RequestUpdateProduct updateRequest = createRequestUpdateProduct(mockProduct.getUuid(), updatedMockStand.getUuid());

    mockProduct.updateProduct(updateRequest);
    mockProduct.updateProduct(updatedMockStand);

    when(service.updateProduct(updateRequest)).thenReturn(mockProduct);

    // When & Then
    mockMvc.perform(put("/products")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(updateRequest)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.uuid").value(mockProduct.getUuid().toString()))
        .andExpect(jsonPath("$.productName").value(mockProduct.getProductName()))
        .andExpect(jsonPath("$.price").value(mockProduct.getPrice()))
        .andExpect(jsonPath("$.discount").value(mockProduct.getDiscount()))
        .andExpect(jsonPath("$.stock").value(mockProduct.getStock()))
        .andExpect(jsonPath("$.productImg").value(mockProduct.getProductImg()))
        .andExpect(jsonPath("$.stand.uuid").value(updatedMockStand.getUuid().toString()))
        .andExpect(jsonPath("$.stand.stand").value(updatedMockStand.getFunctionName()))
        .andExpect(jsonPath("$.stand.association.uuid").value(mockAssociation.getUuid().toString()))
        .andExpect(jsonPath("$.stand.association.association").value(mockAssociation.getAssociationName()))
        .andExpect(jsonPath("$.stand.association.principalName").value(mockAssociation.getPrincipalName()));

    // Verify interactions
    verify(service, times(1)).updateProduct(updateRequest);
    verifyNoMoreInteractions(service);
  }

  @Test
  void deleteProduct() throws Exception {
    // Given
    RequestUpdateProduct deleteRequest = createRequestUpdateProduct(UUID.randomUUID(), UUID.randomUUID());

    doNothing().when(service).deleteProduct(deleteRequest);

    // When & Then
    mockMvc.perform(delete("/products")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(deleteRequest)))
        .andExpect(status().isNoContent());

    // Verify interactions
    verify(service, times(1)).deleteProduct(deleteRequest);
    verifyNoMoreInteractions(service);
  }
}
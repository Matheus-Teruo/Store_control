package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.BaseControllerTest;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.customers.OrderCard;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestUpdatePurchase;
import com.storecontrol.backend.models.operations.purchases.response.ResponsePurchase;
import com.storecontrol.backend.models.operations.purchases.response.ResponseSummaryPurchase;
import com.storecontrol.backend.models.operations.request.RequestCreateRecharge;
import com.storecontrol.backend.models.operations.request.RequestDeleteRecharge;
import com.storecontrol.backend.models.operations.response.ResponseRecharge;
import com.storecontrol.backend.models.operations.response.ResponseSummaryRecharge;
import com.storecontrol.backend.models.registers.CashRegister;
import com.storecontrol.backend.models.registers.request.RequestUpdateCashRegister;
import com.storecontrol.backend.models.registers.response.ResponseCashRegister;
import com.storecontrol.backend.models.stands.response.ResponseProduct;
import com.storecontrol.backend.services.operations.PurchaseService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

class PurchaseControllerTest extends BaseControllerTest {

  @MockBean
  PurchaseService service;

  @Test
  void testCreatePurchaseSuccess() throws Exception {
    // Given
    String cardId = "CardIDTest12345";
    OrderCard mockOrderCard = createOrderCardEntity(cardId, true);
    Customer mockCustomer = createCustomerEntity(UUID.randomUUID(), mockOrderCard,false);

    Purchase mockPurchase = createPurchaseEntity(UUID.randomUUID(), mockCustomer);
    mockPurchase.setItems(createItemEntity(mockPurchase));
    RequestCreatePurchase requestPurchase = createRequestCreatePurchase(mockPurchase);
    ResponsePurchase expectedResponse = new ResponsePurchase(mockPurchase);

    when(service.createPurchase(requestPurchase)).thenReturn(mockPurchase);

    // When
    String jsonResponse = performPostCreate("purchases", requestPurchase, mockPurchase.getUuid());

    // Then
    ResponsePurchase actualResponse = fromJson(jsonResponse, ResponsePurchase.class);
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).createPurchase(requestPurchase);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadPurchaseSuccess() throws Exception {
    // Given
    UUID purchaseUuid = UUID.randomUUID();

    String cardId = "CardIDTest12345";
    OrderCard mockOrderCard = createOrderCardEntity(cardId, true);
    Customer mockCustomer = createCustomerEntity(UUID.randomUUID(), mockOrderCard,false);

    Purchase mockPurchase = createPurchaseEntity(purchaseUuid, mockCustomer);
    mockPurchase.setItems(createItemEntity(mockPurchase));
    ResponsePurchase expectedResponse = new ResponsePurchase(mockPurchase);

    when(service.takePurchaseByUuid(purchaseUuid)).thenReturn(mockPurchase);

    // When
    String jsonResponse = performGetWithVariablePath("purchases", purchaseUuid);

    // Then
    ResponsePurchase actualResponse = fromJson(jsonResponse, ResponsePurchase.class);
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).takePurchaseByUuid(purchaseUuid);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadPurchasesSuccess() throws Exception {
    // Given
    String cardId1 = "CardIDTest12345";
    OrderCard mockOrderCard1 = createOrderCardEntity(cardId1, true);
    Customer mockCustomer1 = createCustomerEntity(UUID.randomUUID(), mockOrderCard1,false);
    Customer mockCustomer2 = createCustomerEntity(UUID.randomUUID(), mockOrderCard1,false);

    List<Purchase> mockPurchases = List.of(
        createPurchaseEntity(UUID.randomUUID(), mockCustomer1),
        createPurchaseEntity(UUID.randomUUID(), mockCustomer2)
    );
    mockPurchases.get(0).setItems(createItemEntity(mockPurchases.get(0)));
    mockPurchases.get(1).setItems(createItemEntity(mockPurchases.get(1)));

    List<ResponseSummaryPurchase> expectedResponse = mockPurchases.stream()
        .map(ResponseSummaryPurchase::new)
        .toList();

    when(service.listPurchases()).thenReturn(mockPurchases);

    // When
    String jsonResponse = performGetList("purchases")
        .andExpect(jsonPath("$.length()").value(2))
        .andReturn().getResponse().getContentAsString();

    // Then
    List<ResponseSummaryPurchase> actualResponse = List.of(fromJson(jsonResponse, ResponseSummaryPurchase[].class));
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).listPurchases();
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadLast3PurchasesSuccess() throws Exception {
    // Given
    UUID userUuid = UUID.randomUUID();
    String cardId1 = "CardIDTest12345";
    OrderCard mockOrderCard1 = createOrderCardEntity(cardId1, true);
    Customer mockCustomer1 = createCustomerEntity(UUID.randomUUID(), mockOrderCard1,false);
    Customer mockCustomer2 = createCustomerEntity(UUID.randomUUID(), mockOrderCard1,false);

    List<Purchase> mockPurchases = List.of(
        createPurchaseEntity(UUID.randomUUID(), mockCustomer1),
        createPurchaseEntity(UUID.randomUUID(), mockCustomer2),
        createPurchaseEntity(UUID.randomUUID(), mockCustomer2)
    );
    mockPurchases.get(0).setItems(createItemEntity(mockPurchases.get(0)));
    mockPurchases.get(1).setItems(createItemEntity(mockPurchases.get(1)));
    mockPurchases.get(2).setItems(createItemEntity(mockPurchases.get(2)));

    List<ResponseSummaryPurchase> expectedResponse = mockPurchases.stream()
        .map(ResponseSummaryPurchase::new)
        .toList();

    when(service.listLast3Purchases(userUuid)).thenReturn(mockPurchases);

    // When
    String jsonResponse = mockMvc.perform(get("/purchases/last3")
            .requestAttr("UserUuid", userUuid)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.length()").value(3))
        .andReturn().getResponse().getContentAsString();

    // Then
    List<ResponseSummaryPurchase> actualResponse = List.of(fromJson(jsonResponse, ResponseSummaryPurchase[].class));
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).listLast3Purchases(userUuid);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testUpdatePurchaseSuccess() throws Exception {
    // Given
    String cardId = "CardIDTest12345";
    OrderCard mockOrderCard = createOrderCardEntity(cardId, true);
    Customer mockCustomer = createCustomerEntity(UUID.randomUUID(), mockOrderCard,false);

    Purchase mockPurchase = createPurchaseEntity(UUID.randomUUID(), mockCustomer);
    mockPurchase.setItems(createItemEntity(mockPurchase));

    Purchase mockUpdatePurchase = createPurchaseEntity(UUID.randomUUID(), mockCustomer);
    mockUpdatePurchase.setItems(createItemEntity(mockUpdatePurchase));

    RequestUpdatePurchase updateRequest = createRequestUpdatePurchase(UUID.randomUUID(), mockUpdatePurchase);

    mockPurchase.updatePurchase(updateRequest);
    ResponsePurchase expectedResponse = new ResponsePurchase(mockPurchase);

    when(service.updatePurchase(updateRequest)).thenReturn(mockPurchase);

    // When
    String jsonResponse = performPut("purchases", updateRequest);

    // Then
    ResponsePurchase actualResponse = fromJson(jsonResponse, ResponsePurchase.class);
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).updatePurchase(updateRequest);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testDeletePurchaseSuccess() throws Exception {
    // Given
    String cardId = "CardIDTest12345";
    OrderCard mockOrderCard = createOrderCardEntity(cardId, true);
    Customer mockCustomer = createCustomerEntity(UUID.randomUUID(), mockOrderCard,false);

    Purchase mockPurchase = createPurchaseEntity(UUID.randomUUID(), mockCustomer);
    mockPurchase.setItems(createItemEntity(mockPurchase));
    RequestUpdatePurchase deleteRequest = createRequestUpdatePurchase(UUID.randomUUID(), mockPurchase);

    doNothing().when(service).deletePurchase(deleteRequest);

    // When & Then
    performDelete("purchases", deleteRequest);

    // Verify interactions
    verify(service, times(1)).deletePurchase(deleteRequest);
    verifyNoMoreInteractions(service);
  }
}
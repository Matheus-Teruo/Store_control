package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.BaseTest;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.customers.OrderCard;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestUpdatePurchase;
import com.storecontrol.backend.models.operations.purchases.response.ResponsePurchase;
import com.storecontrol.backend.models.operations.purchases.response.ResponseSummaryPurchase;
import com.storecontrol.backend.services.operations.PurchaseService;
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
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class PurchaseTest extends BaseTest {

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

    when(service.createPurchase(requestPurchase, mockPurchase.getVoluntary().getUuid())).thenReturn(mockPurchase);

    // When & Then
    mockMvc.perform(post("/purchases")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(requestPurchase))
            .requestAttr("UserUuid", mockPurchase.getVoluntary().getUuid()))
        .andExpect(status().isCreated())
        .andExpect(header().string("Location",
            containsString("/purchases/" + mockPurchase.getUuid().toString())))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).createPurchase(requestPurchase, mockPurchase.getVoluntary().getUuid());
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

    // When & Then
    mockMvc.perform(get("/purchases/{uuid}", purchaseUuid)
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

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

    Page<Purchase> mockPage = new PageImpl<>(mockPurchases);
    Page<ResponseSummaryPurchase> expectedResponse = mockPage
        .map(ResponseSummaryPurchase::new);

    when(service.pagePurchases(any(Pageable.class))).thenReturn(mockPage);

    // When & Then
    mockMvc.perform(get("/purchases")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).pagePurchases(any(Pageable.class));
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

    // When & Then
    mockMvc.perform(get("/purchases/last3")
            .requestAttr("UserUuid", userUuid)
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(3))
        .andExpect(content().json(toJson(expectedResponse)));

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

    // When & Then
    mockMvc.perform(put("/purchases")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(updateRequest)))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

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

    doNothing().when(service).deletePurchase(mockPurchase.getUuid(), mockPurchase.getVoluntary().getUuid());

    // When & Then
    mockMvc.perform(delete("/purchases/{uuid}", mockPurchase.getUuid())
            .contentType(MediaType.APPLICATION_JSON)
            .requestAttr("UserUuid", mockPurchase.getVoluntary().getUuid()))
        .andExpect(status().isNoContent());

    // Verify interactions
    verify(service, times(1)).deletePurchase(mockPurchase.getUuid(), mockPurchase.getVoluntary().getUuid());
    verifyNoMoreInteractions(service);
  }
}
package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.BaseTest;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.customers.OrderCard;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.operations.request.RequestCreateRecharge;
import com.storecontrol.backend.models.operations.request.RequestCreateTrade;
import com.storecontrol.backend.models.operations.response.ResponseTrade;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.services.operations.TradeService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;

import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class TradeTest extends BaseTest {

  @MockBean
  TradeService service;

  @Test
  void testCreateTradeSuccess() throws Exception {
    // Given
    String cardId = "CardIDTest12345";
    OrderCard mockOrderCard = createOrderCardEntity(cardId, true);
    Customer mockCustomer = createCustomerEntity(UUID.randomUUID(), mockOrderCard,false);
    Voluntary mockVoluntary = createVoluntaryEntity(UUID.randomUUID());

    Recharge mockRecharge = createRechargeEntity(UUID.randomUUID(), mockCustomer, false);
    Purchase mockPurchase = createPurchaseEntity(UUID.randomUUID(), mockCustomer);
    mockPurchase.setItems(createItemEntity(mockPurchase));
    RequestCreateTrade requestTrade = createRequestCreateTrade(mockRecharge, mockPurchase, mockOrderCard);
    ResponseTrade expectedResponse = new ResponseTrade(mockRecharge, mockPurchase);

    when(service.createTrade(
        any(RequestCreateRecharge.class),
        any(RequestCreatePurchase.class),
        eq(mockVoluntary.getUuid())))
        .thenReturn(expectedResponse);

    // When & Then
    mockMvc.perform(post("/trades")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(requestTrade))
            .requestAttr("UserUuid", mockVoluntary.getUuid()))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1))
        .createTrade(
            any(RequestCreateRecharge.class),
            any(RequestCreatePurchase.class),
            eq(mockVoluntary.getUuid()));
    verifyNoMoreInteractions(service);
  }
}

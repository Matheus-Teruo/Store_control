package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.BaseTest;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.customers.OrderCard;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.operations.request.RequestCreateRecharge;
import com.storecontrol.backend.models.operations.request.RequestDeleteRecharge;
import com.storecontrol.backend.models.operations.response.ResponseRecharge;
import com.storecontrol.backend.models.operations.response.ResponseSummaryRecharge;
import com.storecontrol.backend.services.operations.RechargeService;
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

class RechargeTest extends BaseTest {

  @MockBean
  RechargeService service;

  @Test
  void testCreateRechargeSuccess() throws Exception {
    // Given
    String cardId = "CardIDTest12345";
    OrderCard mockOrderCard = createOrderCardEntity(cardId, true);
    Customer mockCustomer = createCustomerEntity(UUID.randomUUID(), mockOrderCard,false);

    Recharge mockRecharge = createRechargeEntity(UUID.randomUUID(), mockCustomer, false);
    RequestCreateRecharge requestRecharge = createRequestCreateRecharge(mockRecharge);
    ResponseRecharge expectedResponse = new ResponseRecharge(mockRecharge);

    when(service.createRecharge(requestRecharge, mockRecharge.getVoluntary().getUuid())).thenReturn(mockRecharge);

    // When & Then
    mockMvc.perform(post("/recharges")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(requestRecharge))
            .requestAttr("UserUuid", mockRecharge.getVoluntary().getUuid()))
        .andExpect(status().isCreated())
        .andExpect(header().string("Location",
            containsString("/recharges/" + mockRecharge.getUuid().toString())))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).createRecharge(requestRecharge, mockRecharge.getVoluntary().getUuid());
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadRechargeSuccess() throws Exception {
    // Given
    UUID rechargeUuid = UUID.randomUUID();

    String cardId = "CardIDTest12345";
    OrderCard mockOrderCard = createOrderCardEntity(cardId, true);
    Customer mockCustomer = createCustomerEntity(UUID.randomUUID(), mockOrderCard,false);

    Recharge mockRefund = createRechargeEntity(rechargeUuid, mockCustomer, false);

    ResponseRecharge expectedResponse = new ResponseRecharge(mockRefund);

    when(service.takeRechargeByUuid(rechargeUuid)).thenReturn(mockRefund);

    // When & Then
    mockMvc.perform(get("/recharges/{uuid}", rechargeUuid)
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).takeRechargeByUuid(rechargeUuid);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadRechargesSuccess() throws Exception {
    // Given
    String cardId1 = "CardIDTest12345";
    OrderCard mockOrderCard1 = createOrderCardEntity(cardId1, true);
    Customer mockCustomer1 = createCustomerEntity(UUID.randomUUID(), mockOrderCard1,false);
    Customer mockCustomer2 = createCustomerEntity(UUID.randomUUID(), mockOrderCard1,false);

    List<Recharge> mockRecharges = List.of(
        createRechargeEntity(UUID.randomUUID(), mockCustomer1, false),
        createRechargeEntity(UUID.randomUUID(), mockCustomer2, false)
    );
    List<ResponseSummaryRecharge> expectedResponse = mockRecharges.stream()
        .map(ResponseSummaryRecharge::new)
        .toList();

    when(service.listRecharges()).thenReturn(mockRecharges);

    // When & Then
    mockMvc.perform(get("/recharges")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).listRecharges();
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadLast3RechargesSuccess() throws Exception {
    // Given
    UUID userUuid = UUID.randomUUID();
    String cardId1 = "order_card12345";
    OrderCard mockOrderCard1 = createOrderCardEntity(cardId1, true);
    Customer mockCustomer1 = createCustomerEntity(UUID.randomUUID(), mockOrderCard1,false);
    Customer mockCustomer2 = createCustomerEntity(UUID.randomUUID(), mockOrderCard1,false);

    List<Recharge> mockRecharges = List.of(
        createRechargeEntity(UUID.randomUUID(), mockCustomer1, false),
        createRechargeEntity(UUID.randomUUID(), mockCustomer2, false),
        createRechargeEntity(UUID.randomUUID(), mockCustomer2, true)
    );
    List<ResponseSummaryRecharge> expectedResponse = mockRecharges.stream()
        .map(ResponseSummaryRecharge::new)
        .toList();

    when(service.listLast3Purchases(userUuid)).thenReturn(mockRecharges);

    // When & Then
    mockMvc.perform(get("/recharges/last3")
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
  void testDeleteRechargeSuccess() throws Exception {
    // Given
    String cardId = "CardIDTest12345";
    OrderCard mockOrderCard = createOrderCardEntity(cardId, true);
    Customer mockCustomer = createCustomerEntity(UUID.randomUUID(), mockOrderCard,false);

    Recharge mockRecharge = createRechargeEntity(UUID.randomUUID(), mockCustomer, false);

    doNothing().when(service).deleteRecharge(mockRecharge.getUuid(), mockRecharge.getVoluntary().getUuid());

    // When & Then
    mockMvc.perform(delete("/recharges/{uuid}", mockRecharge.getUuid())
            .contentType(MediaType.APPLICATION_JSON)
            .requestAttr("UserUuid", mockRecharge.getVoluntary().getUuid()))
        .andExpect(status().isNoContent());

    // Verify interactions
    verify(service, times(1)).deleteRecharge(mockRecharge.getUuid(), mockRecharge.getVoluntary().getUuid());
    verifyNoMoreInteractions(service);
  }
}
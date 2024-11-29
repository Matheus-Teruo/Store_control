package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.BaseControllerTest;
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

import java.util.List;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

class RechargeControllerTest extends BaseControllerTest {

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

    when(service.createRecharge(requestRecharge)).thenReturn(mockRecharge);

    // When
    String jsonResponse = performPostCreate("recharges", requestRecharge, mockRecharge.getUuid());

    // Then
    ResponseRecharge actualResponse = fromJson(jsonResponse, ResponseRecharge.class);
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).createRecharge(requestRecharge);
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

    // When
    String jsonResponse = performGetWithVariablePath("recharges", rechargeUuid);

    // Then
    ResponseRecharge actualResponse = fromJson(jsonResponse, ResponseRecharge.class);
    assertEquals(expectedResponse, actualResponse);

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

    // When
    String jsonResponse = performGetList("recharges")
        .andExpect(jsonPath("$.length()").value(2))
        .andReturn().getResponse().getContentAsString();

    // Then
    List<ResponseSummaryRecharge> actualResponse = List.of(fromJson(jsonResponse, ResponseSummaryRecharge[].class));
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).listRecharges();
    verifyNoMoreInteractions(service);
  }

  @Test
  void testDeleteRechargeSuccess() throws Exception {
    // Given
    RequestDeleteRecharge deleteRequest = createRequestDeleteRecharge(UUID.randomUUID());

    doNothing().when(service).deleteRecharge(deleteRequest);

    // When & Then
    performDelete("recharges", deleteRequest);

    // Verify interactions
    verify(service, times(1)).deleteRecharge(deleteRequest);
    verifyNoMoreInteractions(service);
  }
}
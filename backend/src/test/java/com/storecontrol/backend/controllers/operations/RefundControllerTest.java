package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.BaseControllerTest;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.customers.OrderCard;
import com.storecontrol.backend.models.operations.Refund;
import com.storecontrol.backend.models.operations.response.ResponseRefund;
import com.storecontrol.backend.models.operations.response.ResponseSummaryRefund;
import com.storecontrol.backend.services.operations.RefundService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class RefundControllerTest extends BaseControllerTest {

  @MockBean
  RefundService service;

  @Test
  void testReadRefundSuccess() throws Exception {
    // Given
    UUID refundUuid = UUID.randomUUID();

    String cardId = "CardIDTest12345";
    OrderCard mockOrderCard = createOrderCardEntity(cardId, true);
    Customer mockCustomer = createCustomerEntity(UUID.randomUUID(), mockOrderCard,false);
    Refund mockRefund = createRefundEntity(refundUuid, mockCustomer);

    ResponseRefund expectedResponse = new ResponseRefund(mockRefund);

    when(service.takeRefundByUuid(refundUuid)).thenReturn(mockRefund);

    // When & Then
    mockMvc.perform(get("/refunds/{uuid}", refundUuid)
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).takeRefundByUuid(refundUuid);
    verifyNoMoreInteractions(service);
  }

  @Test
  void readRefunds() throws Exception {
    // Given
    String cardId1 = "CardIDTest12345";
    OrderCard mockOrderCard1 = createOrderCardEntity(cardId1, true);
    Customer mockCustomer1 = createCustomerEntity(UUID.randomUUID(), mockOrderCard1,false);
    Customer mockCustomer2 = createCustomerEntity(UUID.randomUUID(), mockOrderCard1,false);
    List<Refund> mockRefunds = List.of(
        createRefundEntity(UUID.randomUUID(), mockCustomer1),
        createRefundEntity(UUID.randomUUID(), mockCustomer2)
    );
    List<ResponseSummaryRefund> expectedResponse = mockRefunds.stream()
        .map(ResponseSummaryRefund::new)
        .toList();

    when(service.listRefunds()).thenReturn(mockRefunds);

    // When & Then
    mockMvc.perform(get("/refunds")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).listRefunds();
    verifyNoMoreInteractions(service);
  }
}
package com.storecontrol.backend.controllers.customers;

import com.storecontrol.backend.BaseControllerTest;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.customers.OrderCard;
import com.storecontrol.backend.models.customers.request.RequestCustomerFinalization;
import com.storecontrol.backend.models.customers.request.RequestOrderCard;
import com.storecontrol.backend.models.customers.response.ResponseCustomer;
import com.storecontrol.backend.models.customers.response.ResponseSummaryCustomer;
import com.storecontrol.backend.services.customers.CustomerFinalizationHandler;
import com.storecontrol.backend.services.customers.CustomerService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

class CustomerControllerTest extends BaseControllerTest {

  @MockBean
  CustomerService service;

  @MockBean
  CustomerFinalizationHandler customerFinalizationHandler;

  @Test
  void testReadCustomerSuccess() throws Exception {
    // Given
    UUID customerUuid = UUID.randomUUID();

    String cardId = "CardIDTest12345";
    OrderCard mockOrderCard = createOrderCardEntity(cardId, true);

    Customer mockCustomer = createCustomerEntity(customerUuid, mockOrderCard,false);
    ResponseCustomer expectedResponse = new ResponseCustomer(mockCustomer);

    when(service.takeFilteredCustomerByUuid(customerUuid)).thenReturn(mockCustomer);

    // When
    String jsonResponse = performGetWithVariablePath("customers", customerUuid);

    // Then
    ResponseCustomer actualResponse = fromJson(jsonResponse, ResponseCustomer.class);
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).takeFilteredCustomerByUuid(customerUuid);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadActiveCustomersSuccess() throws Exception {
    // Given
    String cardId1 = "CardIDTest12345";
    String cardId2 = "CardIDTest54321";
    OrderCard mockOrderCard1 = createOrderCardEntity(cardId1, true);
    OrderCard mockOrderCard2 = createOrderCardEntity(cardId2, true);

    List<Customer> mockCustomers = List.of(
        createCustomerEntity(UUID.randomUUID(), mockOrderCard1,false),
        createCustomerEntity(UUID.randomUUID(), mockOrderCard2,true)
    );
    List<ResponseSummaryCustomer> expectedResponse = mockCustomers.stream()
        .map(ResponseSummaryCustomer::new)
        .toList();

    when(service.listActiveCustomers()).thenReturn(mockCustomers);

    // When
    String jsonResponse = performGetList("customers/active")
        .andExpect(jsonPath("$.length()").value(2))
        .andReturn().getResponse().getContentAsString();

    // Then
    List<ResponseSummaryCustomer> actualResponse = List.of(fromJson(jsonResponse, ResponseSummaryCustomer[].class));
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).listActiveCustomers();
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadCustomersSuccess() throws Exception {
    // Given
    String cardId1 = "CardIDTest12345";
    String cardId2 = "CardIDTest54321";
    OrderCard mockOrderCard1 = createOrderCardEntity(cardId1, true);
    OrderCard mockOrderCard2 = createOrderCardEntity(cardId2, true);

    List<Customer> mockCustomers = List.of(
        createCustomerEntity(UUID.randomUUID(), mockOrderCard1,false),
        createCustomerEntity(UUID.randomUUID(), mockOrderCard2,true)
    );
    List<ResponseSummaryCustomer> expectedResponse = mockCustomers.stream()
        .map(ResponseSummaryCustomer::new)
        .toList();

    when(service.listCustomers()).thenReturn(mockCustomers);

    // When
    String jsonResponse = performGetList("customers")
        .andExpect(jsonPath("$.length()").value(2))
        .andReturn().getResponse().getContentAsString();

    // Then
    List<ResponseSummaryCustomer> actualResponse = List.of(fromJson(jsonResponse, ResponseSummaryCustomer[].class));
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).listCustomers();
    verifyNoMoreInteractions(service);
  }

  @Test
  void testFinalizeCustomerSuccess() throws Exception {
    // Given
    UUID customerUuid = UUID.randomUUID();

    String cardId = "CardIDTest12345";
    OrderCard mockOrderCard = createOrderCardEntity(cardId, true);

    Customer mockCustomer = createCustomerEntity(customerUuid, mockOrderCard,false);
    RequestCustomerFinalization request = createRequestCustomerFinalization(mockCustomer);
    ResponseCustomer expectedResponse = new ResponseCustomer(mockCustomer);

    when(customerFinalizationHandler.finalizeCustomer(request)).thenReturn(mockCustomer);

    // When
    String jsonResponse = performPost("customers/finalize", request);

    // Then
    ResponseCustomer actualResponse = fromJson(jsonResponse, ResponseCustomer.class);
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(customerFinalizationHandler, times(1)).finalizeCustomer(request);
    verifyNoMoreInteractions(customerFinalizationHandler);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testUndoFinalizeCustomerSuccess() throws Exception {
    // Given
    UUID customerUuid = UUID.randomUUID();

    String cardId = "CardIDTest12345";

    RequestOrderCard requestOrderCard = createRequestOrderCard(cardId);
    OrderCard mockOrderCard = createOrderCardEntity(cardId, true);

    Customer mockCustomer = createCustomerEntity(customerUuid, mockOrderCard,false);
    ResponseCustomer expectedResponse = new ResponseCustomer(mockCustomer);

    when(customerFinalizationHandler.undoFinalizeCustomer(requestOrderCard)).thenReturn(mockCustomer);

    // When
    String jsonResponse = performDeleteIsOk("customers/finalize", requestOrderCard);

    // Then
    ResponseCustomer actualResponse = fromJson(jsonResponse, ResponseCustomer.class);
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(customerFinalizationHandler, times(1)).undoFinalizeCustomer(requestOrderCard);
    verifyNoMoreInteractions(customerFinalizationHandler);
    verifyNoMoreInteractions(service);
  }
}
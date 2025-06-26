package com.storecontrol.backend.controllers.customers;

import com.storecontrol.backend.BaseTest;
import com.storecontrol.backend.models.customers.Card;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.customers.request.RequestCard;
import com.storecontrol.backend.models.customers.request.RequestCustomerFinalization;
import com.storecontrol.backend.models.customers.response.ResponseCustomer;
import com.storecontrol.backend.models.customers.response.ResponseCustomerCard;
import com.storecontrol.backend.models.customers.response.ResponseSummaryCustomer;
import com.storecontrol.backend.services.customers.CustomerFinalizationHandler;
import com.storecontrol.backend.services.customers.CustomerService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CustomerTest extends BaseTest {

  @MockBean
  private CustomerService service;

  @MockBean
  private CustomerFinalizationHandler customerFinalizationHandler;

  @Test
  void testReadCustomerSuccess() throws Exception {
    // Given
    UUID customerUuid = UUID.randomUUID();

    String cardId = "CardIDTest12345";
    Card mockCard = createCardEntity(cardId, true);

    Customer mockCustomer = createCustomerEntity(customerUuid, mockCard,false);
    ResponseCustomer expectedResponse = new ResponseCustomer(mockCustomer);

    when(service.takeFilteredCustomerByUuid(customerUuid)).thenReturn(mockCustomer);

    // When & Then
    mockMvc.perform(get("/customers/{uuid}", customerUuid)
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).takeFilteredCustomerByUuid(customerUuid);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadCustomersByCardIdSuccess() throws Exception {
    // Given
    UUID customerUuid = UUID.randomUUID();

    String cardId = "CardIDTest12345";
    Card mockCard = createCardEntity(cardId, true);

    Customer mockCustomer = createCustomerEntity(customerUuid, mockCard,false);
    ResponseCustomerCard expectedResponse = new ResponseCustomerCard(mockCustomer);

    when(service.takeActiveCustomerByCardId(cardId)).thenReturn(mockCustomer);

    // When & Then
    mockMvc.perform(get("/customers/card/{cardId}", cardId)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).takeActiveCustomerByCardId(cardId);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadActiveCustomersSuccess() throws Exception {
    // Given
    String cardId1 = "CardIDTest12345";
    String cardId2 = "CardIDTest54321";
    Card mockCard1 = createCardEntity(cardId1, true);
    Card mockCard2 = createCardEntity(cardId2, true);

    List<Customer> mockCustomers = List.of(
        createCustomerEntity(UUID.randomUUID(), mockCard1,false),
        createCustomerEntity(UUID.randomUUID(), mockCard2,true)
    );
    Page<Customer> mockPage = new PageImpl<>(mockCustomers);
    Page<ResponseSummaryCustomer> expectedResponse = mockPage
        .map(ResponseSummaryCustomer::new);

    when(service.pageActiveCustomers(any(Pageable.class))).thenReturn(mockPage);

    // When & Then
    mockMvc.perform(get("/customers/active")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).pageActiveCustomers(any(Pageable.class));
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadCustomersSuccess() throws Exception {
    // Given
    String cardId1 = "CardIDTest12345";
    String cardId2 = "CardIDTest54321";
    Card mockCard1 = createCardEntity(cardId1, true);
    Card mockCard2 = createCardEntity(cardId2, true);

    List<Customer> mockCustomers = List.of(
        createCustomerEntity(UUID.randomUUID(), mockCard1,false),
        createCustomerEntity(UUID.randomUUID(), mockCard2,true)
    );
    Page<Customer> mockPage = new PageImpl<>(mockCustomers);
    Page<ResponseSummaryCustomer> expectedResponse = mockPage
        .map(ResponseSummaryCustomer::new);

    when(service.pageCustomers(any(Pageable.class))).thenReturn(mockPage);

    // When & Then
    mockMvc.perform(get("/customers")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).pageCustomers(any(Pageable.class));
    verifyNoMoreInteractions(service);
  }

  @Test
  void testFinalizeCustomerSuccess() throws Exception {
    // Given
    UUID customerUuid = UUID.randomUUID();

    String cardId = "CardIDTest12345";
    Card mockCard = createCardEntity(cardId, true);

    Customer mockCustomer = createCustomerEntity(customerUuid, mockCard,false);
    RequestCustomerFinalization request = createRequestCustomerFinalization(mockCustomer);
    ResponseCustomer expectedResponse = new ResponseCustomer(mockCustomer);

    when(customerFinalizationHandler.finalizeCustomer(request)).thenReturn(mockCustomer);

    // When & Then
    mockMvc.perform(post("/customers/finalize")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(request)))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

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

    RequestCard requestCard = createRequestCard(cardId);
    Card mockCard = createCardEntity(cardId, true);

    Customer mockCustomer = createCustomerEntity(customerUuid, mockCard,false);
    ResponseCustomer expectedResponse = new ResponseCustomer(mockCustomer);

    when(customerFinalizationHandler.undoFinalizeCustomer(requestCard)).thenReturn(mockCustomer);

    mockMvc.perform(delete("/customers/finalize/{uuid}", cardId)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(customerFinalizationHandler, times(1)).undoFinalizeCustomer(requestCard);
    verifyNoMoreInteractions(customerFinalizationHandler);
    verifyNoMoreInteractions(service);
  }
}
package com.storecontrol.backend.controllers.customers;

import com.storecontrol.backend.BaseTest;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.customers.OrderCard;
import com.storecontrol.backend.models.customers.request.RequestOrderCard;
import com.storecontrol.backend.models.customers.response.ResponseOrderCard;
import com.storecontrol.backend.models.customers.response.ResponseSummaryCustomer;
import com.storecontrol.backend.models.customers.response.ResponseSummaryOrderCard;
import com.storecontrol.backend.services.customers.OrderCardService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;

import java.util.List;

import static com.storecontrol.backend.TestDataFactory.createOrderCardEntity;
import static com.storecontrol.backend.TestDataFactory.createRequestOrderCard;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class OrderCardTest extends BaseTest {

  @MockBean
  OrderCardService service;

  @Test
  void testCreateCardSuccess() throws Exception {
    // Given
    String cardId = "CardIDTest12345";
    OrderCard mockOrderCard = createOrderCardEntity(cardId, false);

    RequestOrderCard requestOrderCard = createRequestOrderCard(cardId);
    ResponseOrderCard expectedResponse = new ResponseOrderCard(mockOrderCard);

    when(service.createOrderCard(requestOrderCard)).thenReturn(mockOrderCard);

    // When & Then
    mockMvc.perform(post("/cards")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(requestOrderCard)))
        .andExpect(status().isCreated())
        .andExpect(header().string("Location", containsString("/cards/" + cardId)))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).createOrderCard(requestOrderCard);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadCardSuccess() throws Exception {
    // Given
    String cardId = "CardIDTest12345";
    OrderCard mockAssociation = createOrderCardEntity(cardId, true);
    ResponseOrderCard expectedResponse = new ResponseOrderCard(mockAssociation);

    when(service.takeOrderCardById(cardId)).thenReturn(mockAssociation);

    // When & Then
    mockMvc.perform(get("/cards/{cardId}", cardId)
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).takeOrderCardById(cardId);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadAllCardsSuccess() throws Exception {
    // Given
    String cardId1 = "CardIDTest12345";
    String cardId2 = "CardIDTest54321";
    List<OrderCard> mockOrderCard = List.of(
        createOrderCardEntity(cardId1, false),
        createOrderCardEntity(cardId2, true)
    );
    Page<OrderCard> mockPage = new PageImpl<>(mockOrderCard);
    Page<ResponseOrderCard> expectedResponse = mockPage
        .map(ResponseOrderCard::new);

    when(service.pageAllOrderCards(any(Pageable.class))).thenReturn(mockPage);

    // When & Then
    mockMvc.perform(get("/cards")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).pageAllOrderCards(any(Pageable.class));
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadActiveCardsSuccess() throws Exception {
    // Given
    String cardId1 = "CardIDTest12345";
    String cardId2 = "CardIDTest54321";
    List<OrderCard> mockOrderCard = List.of(
        createOrderCardEntity(cardId1, false),
        createOrderCardEntity(cardId2, true)
    );
    Page<OrderCard> mockPage = new PageImpl<>(mockOrderCard);
    Page<ResponseSummaryOrderCard> expectedResponse = mockPage
        .map(ResponseSummaryOrderCard::new);

    when(service.pageActiveOrderCards(any(Pageable.class))).thenReturn(mockPage);

    // When & Then
    mockMvc.perform(get("/cards/active")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).pageActiveOrderCards(any(Pageable.class));
    verifyNoMoreInteractions(service);
  }
}
package com.storecontrol.backend.controllers.customers;

import com.storecontrol.backend.BaseControllerTest;
import com.storecontrol.backend.models.customers.OrderCard;
import com.storecontrol.backend.models.customers.request.RequestOrderCard;
import com.storecontrol.backend.models.customers.response.ResponseOrderCard;
import com.storecontrol.backend.models.customers.response.ResponseSummaryOrderCard;
import com.storecontrol.backend.services.customers.OrderCardService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;

import java.util.List;

import static com.storecontrol.backend.TestDataFactory.createOrderCardEntity;
import static com.storecontrol.backend.TestDataFactory.createRequestOrderCard;
import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class OrderCardControllerTest extends BaseControllerTest {

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

    // When
    String jsonResponse = mockMvc.perform(post("/cards")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(requestOrderCard)))
        .andExpect(status().isCreated())
        .andExpect(header().string("Location", containsString("/cards/" + cardId)))
        .andReturn().getResponse().getContentAsString();

    // Then
    ResponseOrderCard actualResponse = fromJson(jsonResponse, ResponseOrderCard.class);
    assertEquals(expectedResponse, actualResponse);

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

    // When
    String jsonResponse = mockMvc.perform(get("/cards/{cardId}", cardId)
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andReturn().getResponse().getContentAsString();

    // Then
    ResponseOrderCard actualResponse = fromJson(jsonResponse, ResponseOrderCard.class);
    assertEquals(expectedResponse, actualResponse);

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
    List<ResponseSummaryOrderCard> expectedResponse = mockOrderCard.stream()
        .map(ResponseSummaryOrderCard::new)
        .toList();

    when(service.listAllOrderCards()).thenReturn(mockOrderCard);

    // When
    String jsonResponse = performGetList("cards")
        .andExpect(jsonPath("$.length()").value(2))
        .andReturn().getResponse().getContentAsString();

    // Then
    List<ResponseSummaryOrderCard> actualResponse = List.of(fromJson(jsonResponse, ResponseSummaryOrderCard[].class));
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).listAllOrderCards();
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
    List<ResponseSummaryOrderCard> expectedResponse = mockOrderCard.stream()
        .map(ResponseSummaryOrderCard::new)
        .toList();

    when(service.listActiveOrderCards()).thenReturn(mockOrderCard);

    // When
    String jsonResponse = performGetList("cards/active")
        .andExpect(jsonPath("$.length()").value(2))
        .andReturn().getResponse().getContentAsString();

    // Then
    List<ResponseSummaryOrderCard> actualResponse = List.of(fromJson(jsonResponse, ResponseSummaryOrderCard[].class));
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).listActiveOrderCards();
    verifyNoMoreInteractions(service);
  }
}
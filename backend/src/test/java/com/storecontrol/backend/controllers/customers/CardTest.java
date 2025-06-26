package com.storecontrol.backend.controllers.customers;

import com.storecontrol.backend.BaseTest;
import com.storecontrol.backend.models.customers.Card;
import com.storecontrol.backend.models.customers.request.RequestCard;
import com.storecontrol.backend.models.customers.response.ResponseCard;
import com.storecontrol.backend.models.customers.response.ResponseSummaryCard;
import com.storecontrol.backend.services.customers.CardService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;

import java.util.List;

import static com.storecontrol.backend.TestDataFactory.createCardEntity;
import static com.storecontrol.backend.TestDataFactory.createRequestCard;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CardTest extends BaseTest {

  @MockBean
  private CardService service;

  @Test
  void testCreateCardSuccess() throws Exception {
    // Given
    String cardId = "CardIDTest12345";
    Card mockCard = createCardEntity(cardId, false);

    RequestCard requestCard = createRequestCard(cardId);
    ResponseCard expectedResponse = new ResponseCard(mockCard);

    when(service.createCard(requestCard)).thenReturn(mockCard);

    // When & Then
    mockMvc.perform(post("/cards")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(requestCard)))
        .andExpect(status().isCreated())
        .andExpect(header().string("Location", containsString("/cards/" + cardId)))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).createCard(requestCard);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadCardSuccess() throws Exception {
    // Given
    String cardId = "CardIDTest12345";
    Card mockAssociation = createCardEntity(cardId, true);
    ResponseCard expectedResponse = new ResponseCard(mockAssociation);

    when(service.takeCardById(cardId)).thenReturn(mockAssociation);

    // When & Then
    mockMvc.perform(get("/cards/{cardId}", cardId)
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).takeCardById(cardId);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadAllCardsSuccess() throws Exception {
    // Given
    String cardId1 = "CardIDTest12345";
    String cardId2 = "CardIDTest54321";
    List<Card> mockCard = List.of(
        createCardEntity(cardId1, false),
        createCardEntity(cardId2, true)
    );
    Page<Card> mockPage = new PageImpl<>(mockCard);
    Page<ResponseCard> expectedResponse = mockPage
        .map(ResponseCard::new);

    when(service.pageAllCards(any(Pageable.class))).thenReturn(mockPage);

    // When & Then
    mockMvc.perform(get("/cards")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).pageAllCards(any(Pageable.class));
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadActiveCardsSuccess() throws Exception {
    // Given
    String cardId1 = "CardIDTest12345";
    String cardId2 = "CardIDTest54321";
    List<Card> mockCard = List.of(
        createCardEntity(cardId1, false),
        createCardEntity(cardId2, true)
    );
    Page<Card> mockPage = new PageImpl<>(mockCard);
    Page<ResponseSummaryCard> expectedResponse = mockPage
        .map(ResponseSummaryCard::new);

    when(service.pageActiveCards(any(Pageable.class))).thenReturn(mockPage);

    // When & Then
    mockMvc.perform(get("/cards/active")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).pageActiveCards(any(Pageable.class));
    verifyNoMoreInteractions(service);
  }
}
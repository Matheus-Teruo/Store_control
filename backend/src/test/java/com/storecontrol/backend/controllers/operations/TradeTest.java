package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.BaseTest;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.customers.OrderCard;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.operations.request.RequestCreateRecharge;
import com.storecontrol.backend.models.operations.trades.Trade;
import com.storecontrol.backend.models.operations.trades.TradeView;
import com.storecontrol.backend.models.operations.trades.request.RequestCreateTrade;
import com.storecontrol.backend.models.operations.trades.response.ResponseSummaryTrade;
import com.storecontrol.backend.models.operations.trades.response.ResponseTrade;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.services.operations.TradeService;
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

public class TradeTest extends BaseTest {

  @MockBean
  private TradeService service;

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
    Trade trade = createTradeEntity(UUID.randomUUID(), mockRecharge.getUuid(), mockPurchase.getUuid());
    RequestCreateTrade requestTrade = createRequestCreateTrade(mockRecharge, mockPurchase, mockOrderCard);
    TradeView tradeView = new TradeView(trade, mockRecharge, mockPurchase);
    ResponseTrade expectedResponse = new ResponseTrade(tradeView);

    when(service.createTrade(
        any(RequestCreateRecharge.class),
        any(RequestCreatePurchase.class)))
        .thenReturn(tradeView);

    // When & Then
    mockMvc.perform(post("/trades")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(requestTrade))
            .requestAttr("UserUuid", mockVoluntary.getUuid()))
        .andExpect(status().isCreated())
        .andExpect(header().string("Location",
            containsString("/trades/" + tradeView.getUuid().toString())))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1))
        .createTrade(
            any(RequestCreateRecharge.class),
            any(RequestCreatePurchase.class));
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadTradeSuccess() throws Exception {
    // Given
    UUID tradeUuid = UUID.randomUUID();

    String cardId = "CardIDTest12345";
    OrderCard mockOrderCard = createOrderCardEntity(cardId, true);
    Customer mockCustomer = createCustomerEntity(UUID.randomUUID(), mockOrderCard,false);

    Recharge mockRecharge = createRechargeEntity(UUID.randomUUID(), mockCustomer, false);
    Purchase mockPurchase = createPurchaseEntity(UUID.randomUUID(), mockCustomer);
    Trade trade = createTradeEntity(tradeUuid, mockRecharge.getUuid(), mockPurchase.getUuid());
    mockPurchase.setItems(createItemEntity(mockPurchase));
    TradeView tradeView = new TradeView(trade, mockRecharge, mockPurchase);
    ResponseTrade expectedResponse = new ResponseTrade(tradeView);

    when(service.takeTradeByUuid(tradeUuid)).thenReturn(tradeView);

    // When & Then
    mockMvc.perform(get("/trades/{uuid}", tradeUuid)
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).takeTradeByUuid(tradeUuid);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadTradesSuccess() throws Exception {
    // Given
    String cardId1 = "CardIDTest12345";
    OrderCard mockOrderCard1 = createOrderCardEntity(cardId1, true);
    Customer mockCustomer1 = createCustomerEntity(UUID.randomUUID(), mockOrderCard1,false);
    Customer mockCustomer2 = createCustomerEntity(UUID.randomUUID(), mockOrderCard1,false);

    List<Recharge> mockRecharges = List.of(
        createRechargeEntity(UUID.randomUUID(), mockCustomer1, false),
        createRechargeEntity(UUID.randomUUID(), mockCustomer2, false)
    );
    List<Purchase> mockPurchases = List.of(
        createPurchaseEntity(UUID.randomUUID(), mockCustomer1),
        createPurchaseEntity(UUID.randomUUID(), mockCustomer2)
    );
    mockPurchases.get(0).setItems(createItemEntity(mockPurchases.get(0)));
    mockPurchases.get(1).setItems(createItemEntity(mockPurchases.get(1)));

    List<Trade> mockTrades = List.of(
        createTradeEntity(UUID.randomUUID(), mockRecharges.get(0).getUuid(), mockPurchases.get(0).getUuid()),
        createTradeEntity(UUID.randomUUID(), mockRecharges.get(1).getUuid(), mockPurchases.get(1).getUuid())
    );
    List<TradeView> mockTradesView = List.of(
        new TradeView(mockTrades.get(0), mockRecharges.get(0), mockPurchases.get(0)),
        new TradeView(mockTrades.get(1), mockRecharges.get(1), mockPurchases.get(1))
    );
    Page<TradeView> mockPage = new PageImpl<>(mockTradesView);
    Page<ResponseSummaryTrade> expectedResponse = mockPage
        .map(ResponseSummaryTrade::new);

    when(service.pageTrades(any(UUID.class), any(Pageable.class))).thenReturn(mockPage);

    // When & Then
    mockMvc.perform(get("/trades?standUuid=550e8400-e29b-41d4-a716-446655440000")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).pageTrades(any(UUID.class), any(Pageable.class));
    verifyNoMoreInteractions(service);
  }

  @Test
  void testDeletePurchaseSuccess() throws Exception {
    // Given
    String cardId = "CardIDTest12345";
    OrderCard mockOrderCard = createOrderCardEntity(cardId, false);
    Customer mockCustomer = createCustomerEntity(UUID.randomUUID(), mockOrderCard,false);

    Recharge mockRecharge = createRechargeEntity(UUID.randomUUID(), mockCustomer, false);
    Purchase mockPurchase = createPurchaseEntity(UUID.randomUUID(), mockCustomer);
    mockPurchase.setItems(createItemEntity(mockPurchase));
    Trade trade = createTradeEntity(UUID.randomUUID(), mockRecharge.getUuid(), mockPurchase.getUuid());
    mockCustomer.setPurchases(List.of(mockPurchase));
    mockCustomer.setRecharges(List.of(mockRecharge));

    doNothing().when(service).deleteTrade(cardId, trade.getUuid());

    // When & Then
    mockMvc.perform(delete("/trades/{cardId}/{uuid}", cardId, trade.getUuid())
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNoContent());

    // Verify interactions
    verify(service, times(1)).deleteTrade(cardId, trade.getUuid());
    verifyNoMoreInteractions(service);
  }
}

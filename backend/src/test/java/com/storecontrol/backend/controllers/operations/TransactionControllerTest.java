package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.BaseControllerTest;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.customers.OrderCard;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.operations.Transaction;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.purchases.response.ResponseSummaryPurchase;
import com.storecontrol.backend.models.operations.request.RequestCreateTransaction;
import com.storecontrol.backend.models.operations.request.RequestDeleteRecharge;
import com.storecontrol.backend.models.operations.request.RequestDeleteTransaction;
import com.storecontrol.backend.models.operations.response.ResponseRecharge;
import com.storecontrol.backend.models.operations.response.ResponseSummaryRecharge;
import com.storecontrol.backend.models.operations.response.ResponseSummaryTransaction;
import com.storecontrol.backend.models.operations.response.ResponseTransaction;
import com.storecontrol.backend.services.operations.TransactionService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

class TransactionControllerTest extends BaseControllerTest {

  @MockBean
  TransactionService service;

  @Test
  void testCreateTransactionSuccess() throws Exception {
    // Given
    UUID transactionUuid = UUID.randomUUID();

    Transaction mockTransaction = createTransactionEntity(transactionUuid, false);
    RequestCreateTransaction requestTransaction = createRequestCreateTransaction(mockTransaction);
    ResponseTransaction expectedResponse = new ResponseTransaction(mockTransaction);

    when(service.createTransaction(requestTransaction)).thenReturn(mockTransaction);

    // When
    String jsonResponse = performPostCreate("transactions", requestTransaction, mockTransaction.getUuid());

    // Then
    ResponseTransaction actualResponse = fromJson(jsonResponse, ResponseTransaction.class);
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).createTransaction(requestTransaction);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadTransactionSuccess() throws Exception {
    // Given
    UUID transactionUuid = UUID.randomUUID();

    Transaction mockTransaction = createTransactionEntity(transactionUuid, false);
    ResponseTransaction expectedResponse = new ResponseTransaction(mockTransaction);

    when(service.takeTransactionByUuid(transactionUuid)).thenReturn(mockTransaction);

    // When
    String jsonResponse = performGetWithVariablePath("transactions", transactionUuid);

    // Then
    ResponseTransaction actualResponse = fromJson(jsonResponse, ResponseTransaction.class);
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).takeTransactionByUuid(transactionUuid);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadTransactionsSuccess() throws Exception {
    // Given
    List<Transaction> mockRecharges = List.of(
        createTransactionEntity(UUID.randomUUID(), false),
        createTransactionEntity(UUID.randomUUID(), false)
    );
    List<ResponseSummaryTransaction> expectedResponse = mockRecharges.stream()
        .map(ResponseSummaryTransaction::new)
        .toList();

    when(service.listTransactions()).thenReturn(mockRecharges);

    // When
    String jsonResponse = performGetList("transactions")
        .andExpect(jsonPath("$.length()").value(2))
        .andReturn().getResponse().getContentAsString();

    // Then
    List<ResponseSummaryTransaction> actualResponse = List.of(fromJson(jsonResponse, ResponseSummaryTransaction[].class));
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).listTransactions();
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadLast3TransactionsSuccess() throws Exception {
    // Given
    UUID userUuid = UUID.randomUUID();

    List<Transaction> mockTransactions = List.of(
        createTransactionEntity(UUID.randomUUID(), false),
        createTransactionEntity(UUID.randomUUID(), false),
        createTransactionEntity(UUID.randomUUID(), false)
    );
    List<ResponseSummaryTransaction> expectedResponse = mockTransactions.stream()
        .map(ResponseSummaryTransaction::new)
        .toList();

    when(service.listLast3Purchases(userUuid)).thenReturn(mockTransactions);

    // When
    String jsonResponse = mockMvc.perform(get("/transactions/last3")
            .requestAttr("UserUuid", userUuid)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.length()").value(3))
        .andReturn().getResponse().getContentAsString();

    // Then
    List<ResponseSummaryTransaction> actualResponse = List.of(fromJson(jsonResponse, ResponseSummaryTransaction[].class));
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).listLast3Purchases(userUuid);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testDeleteTransactionSuccess() throws Exception {
    // Given
    RequestDeleteTransaction deleteRequest = createRequestDeleteTransaction(UUID.randomUUID());

    doNothing().when(service).deleteTransaction(deleteRequest);

    // When & Then
    performDelete("transactions", deleteRequest);

    // Verify interactions
    verify(service, times(1)).deleteTransaction(deleteRequest);
    verifyNoMoreInteractions(service);
  }
}
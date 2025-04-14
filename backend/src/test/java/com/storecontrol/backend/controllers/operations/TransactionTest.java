package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.BaseTest;
import com.storecontrol.backend.models.operations.Transaction;
import com.storecontrol.backend.models.operations.request.RequestCreateTransaction;
import com.storecontrol.backend.models.operations.response.ResponseSummaryTransaction;
import com.storecontrol.backend.models.operations.response.ResponseTransaction;
import com.storecontrol.backend.services.operations.TransactionService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.createRequestCreateTransaction;
import static com.storecontrol.backend.TestDataFactory.createTransactionEntity;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class TransactionTest extends BaseTest {

  @MockBean
  private TransactionService service;

  @Test
  void testCreateTransactionSuccess() throws Exception {
    // Given
    UUID transactionUuid = UUID.randomUUID();

    Transaction mockTransaction = createTransactionEntity(transactionUuid, false);
    RequestCreateTransaction requestTransaction = createRequestCreateTransaction(mockTransaction);
    ResponseTransaction expectedResponse = new ResponseTransaction(mockTransaction);

    when(service.createTransaction(requestTransaction)).thenReturn(mockTransaction);

    // When & Then
    mockMvc.perform(post("/transactions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(requestTransaction)))
        .andExpect(status().isCreated())
        .andExpect(header().string("Location",
            containsString("/transactions/" + mockTransaction.getUuid().toString())))
        .andExpect(content().json(toJson(expectedResponse)));

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

    // When & Then
    mockMvc.perform(get("/transactions/{uuid}", transactionUuid)
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).takeTransactionByUuid(transactionUuid);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadTransactionsSuccess() throws Exception {
    // Given
    List<Transaction> mockTransactions = List.of(
        createTransactionEntity(UUID.randomUUID(), false),
        createTransactionEntity(UUID.randomUUID(), false)
    );
    Page<Transaction> mockPage = new PageImpl<>(mockTransactions);
    Page<ResponseSummaryTransaction> expectedResponse = mockPage
        .map(ResponseSummaryTransaction::new);

    when(service.pageTransactions(any(Pageable.class))).thenReturn(mockPage);

    // When & Then
    mockMvc.perform(get("/transactions")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).pageTransactions(any(Pageable.class));
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadLast3TransactionsSuccess() throws Exception {
    // Given
    List<Transaction> mockTransactions = List.of(
        createTransactionEntity(UUID.randomUUID(), false),
        createTransactionEntity(UUID.randomUUID(), false),
        createTransactionEntity(UUID.randomUUID(), false)
    );
    List<ResponseSummaryTransaction> expectedResponse = mockTransactions.stream()
        .map(ResponseSummaryTransaction::new)
        .toList();

    when(service.listLast3Purchases()).thenReturn(mockTransactions);

    // When & Then
    mockMvc.perform(get("/transactions/last3")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(3))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).listLast3Purchases();
    verifyNoMoreInteractions(service);
  }

  @Test
  void testDeleteTransactionSuccess() throws Exception {
    // Given
    Transaction mockTransaction = createTransactionEntity(UUID.randomUUID(), false);

    doNothing().when(service).deleteTransaction(mockTransaction.getUuid());

    // When & Then
    mockMvc.perform(delete("/transactions/{uuid}", mockTransaction.getUuid())
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNoContent());

    // Verify interactions
    verify(service, times(1)).deleteTransaction(mockTransaction.getUuid());
    verifyNoMoreInteractions(service);
  }
}
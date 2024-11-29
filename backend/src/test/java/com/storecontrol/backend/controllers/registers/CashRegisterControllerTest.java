package com.storecontrol.backend.controllers.registers;

import com.storecontrol.backend.BaseControllerTest;
import com.storecontrol.backend.models.registers.CashRegister;
import com.storecontrol.backend.models.registers.request.RequestCreateCashRegister;
import com.storecontrol.backend.models.registers.request.RequestUpdateCashRegister;
import com.storecontrol.backend.models.registers.response.ResponseCashRegister;
import com.storecontrol.backend.models.registers.response.ResponseSummaryCashRegister;
import com.storecontrol.backend.models.stands.Association;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.stands.request.RequestUpdateStand;
import com.storecontrol.backend.models.stands.response.ResponseStand;
import com.storecontrol.backend.models.stands.response.ResponseSummaryStand;
import com.storecontrol.backend.services.registers.CashRegisterService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static com.storecontrol.backend.TestDataFactory.createStandEntity;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

class CashRegisterControllerTest extends BaseControllerTest {

  @MockBean
  CashRegisterService service;

  @Test
  void testCreateCashRegister() throws Exception {
    // Given
    CashRegister mockCashRegister = createCashRegisterEntity(UUID.randomUUID());

    RequestCreateCashRegister requestStand = createRequestCreateCashRegister();
    ResponseCashRegister expectedResponse = new ResponseCashRegister(mockCashRegister);

    when(service.createCashRegister(requestStand)).thenReturn(mockCashRegister);

    // When
    String jsonResponse = performPostCreate("registers", requestStand, mockCashRegister.getUuid());

    // Then
    ResponseCashRegister actualResponse = fromJson(jsonResponse, ResponseCashRegister.class);
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).createCashRegister(requestStand);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadCashRegister() throws Exception {
    // Given
    UUID cashRegisterUuid = UUID.randomUUID();

    CashRegister mockCashRegister = createCashRegisterEntity(cashRegisterUuid);
    ResponseCashRegister expectedResponse = new ResponseCashRegister(mockCashRegister);

    when(service.takeCashRegisterByUuid(cashRegisterUuid)).thenReturn(mockCashRegister);

    // When
    String jsonResponse = performGetWithVariablePath("registers", cashRegisterUuid);

    // Then
    ResponseCashRegister actualResponse = fromJson(jsonResponse, ResponseCashRegister.class);
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).takeCashRegisterByUuid(cashRegisterUuid);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadCashRegisters() throws Exception {
    // Given
    List<CashRegister> mockCashRegisters = List.of(
        createCashRegisterEntity(UUID.randomUUID()),
        createCashRegisterEntity(UUID.randomUUID())
    );
    List<ResponseSummaryCashRegister> expectedResponse = mockCashRegisters.stream()
        .map(ResponseSummaryCashRegister::new)
        .toList();

    when(service.listCashRegisters()).thenReturn(mockCashRegisters);

    // When
    String jsonResponse = performGetList("registers")
        .andExpect(jsonPath("$.length()").value(2))
        .andReturn().getResponse().getContentAsString();

    // Then
    List<ResponseSummaryCashRegister> actualResponse = List.of(fromJson(jsonResponse, ResponseSummaryCashRegister[].class));
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).listCashRegisters();
    verifyNoMoreInteractions(service);
  }

  @Test
  void testUpdateCashRegister() throws Exception {
    // Given
    CashRegister mockCashRegisters = createCashRegisterEntity(UUID.randomUUID());

    RequestUpdateCashRegister updateRequest = createRequestUpdateCashRegister(mockCashRegisters.getUuid());

    mockCashRegisters.updateCashRegister(updateRequest);
    ResponseCashRegister expectedResponse = new ResponseCashRegister(mockCashRegisters);

    when(service.updateCashRegister(updateRequest)).thenReturn(mockCashRegisters);

    // When
    String jsonResponse = performPut("registers", updateRequest);

    // Then
    ResponseCashRegister actualResponse = fromJson(jsonResponse, ResponseCashRegister.class);
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).updateCashRegister(updateRequest);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testDeleteCashRegister() throws Exception {
    // Given
    RequestUpdateCashRegister deleteRequest = createRequestUpdateCashRegister(UUID.randomUUID());

    doNothing().when(service).deleteCashRegister(deleteRequest);

    // When & Then
    performDelete("registers", deleteRequest);

    // Verify interactions
    verify(service, times(1)).deleteCashRegister(deleteRequest);
    verifyNoMoreInteractions(service);
  }
}
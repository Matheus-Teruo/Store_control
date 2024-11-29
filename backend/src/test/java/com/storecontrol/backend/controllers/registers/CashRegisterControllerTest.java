package com.storecontrol.backend.controllers.registers;

import com.storecontrol.backend.BaseControllerTest;
import com.storecontrol.backend.models.registers.CashRegister;
import com.storecontrol.backend.models.registers.request.RequestCreateCashRegister;
import com.storecontrol.backend.models.registers.response.ResponseCashRegister;
import com.storecontrol.backend.models.stands.Association;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.stands.request.RequestCreateStand;
import com.storecontrol.backend.models.stands.response.ResponseStand;
import com.storecontrol.backend.services.registers.CashRegisterService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.verifyNoMoreInteractions;

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
  void testReadCashRegister() {
  }

  @Test
  void testReadCashRegisters() {
  }

  @Test
  void testUpdateCashRegister() {
  }

  @Test
  void testDeleteCashRegister() {
  }
}
package com.storecontrol.backend.controllers.registers;

import com.storecontrol.backend.BaseTest;
import com.storecontrol.backend.models.registers.CashRegister;
import com.storecontrol.backend.models.registers.request.RequestCreateCashRegister;
import com.storecontrol.backend.models.registers.request.RequestUpdateCashRegister;
import com.storecontrol.backend.models.registers.response.ResponseCashRegister;
import com.storecontrol.backend.models.registers.response.ResponseSummaryCashRegister;
import com.storecontrol.backend.models.stands.Association;
import com.storecontrol.backend.models.stands.response.ResponseSummaryAssociation;
import com.storecontrol.backend.services.registers.CashRegisterService;
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

class CashRegisterTest extends BaseTest {

  @MockBean
  CashRegisterService service;

  @Test
  void testCreateCashRegister() throws Exception {
    // Given
    CashRegister mockCashRegister = createCashRegisterEntity(UUID.randomUUID());
    RequestCreateCashRegister requestStand = createRequestCreateCashRegister(mockCashRegister);
    ResponseCashRegister expectedResponse = new ResponseCashRegister(mockCashRegister);

    when(service.createCashRegister(requestStand)).thenReturn(mockCashRegister);

    // When & Then
    mockMvc.perform(post("/registers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(requestStand)))
        .andExpect(status().isCreated())
        .andExpect(header().string("Location",
            containsString("/registers/" + mockCashRegister.getUuid().toString())))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).createCashRegister(requestStand);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadCashRegisterSuccess() throws Exception {
    // Given
    UUID cashRegisterUuid = UUID.randomUUID();

    CashRegister mockCashRegister = createCashRegisterEntity(cashRegisterUuid);
    ResponseCashRegister expectedResponse = new ResponseCashRegister(mockCashRegister);

    when(service.takeCashRegisterByUuid(cashRegisterUuid)).thenReturn(mockCashRegister);

    // When & Then
    mockMvc.perform(get("/registers/{uuid}", cashRegisterUuid)
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).takeCashRegisterByUuid(cashRegisterUuid);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadCashRegistersSuccess() throws Exception {
    // Given
    List<CashRegister> mockCashRegisters = List.of(
        createCashRegisterEntity(UUID.randomUUID()),
        createCashRegisterEntity(UUID.randomUUID())
    );
    Page<CashRegister> mockPage = new PageImpl<>(mockCashRegisters);
    Page<ResponseSummaryCashRegister> expectedResponse = mockPage
        .map(ResponseSummaryCashRegister::new);

    when(service.pageCashRegisters(any(Pageable.class))).thenReturn(mockPage);

    // When & Then
    mockMvc.perform(get("/registers")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).pageCashRegisters(any(Pageable.class));
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadListCashRegistersSuccess() throws Exception {
    // Given
    List<CashRegister> mockCashRegisters = List.of(
        createCashRegisterEntity(UUID.randomUUID()),
        createCashRegisterEntity(UUID.randomUUID())
    );
    List<ResponseSummaryCashRegister> expectedResponse = mockCashRegisters.stream()
        .map(ResponseSummaryCashRegister::new)
        .toList();

    when(service.listCashRegisters()).thenReturn(mockCashRegisters);

    // When & Then
    mockMvc.perform(get("/registers/list")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).listCashRegisters();
    verifyNoMoreInteractions(service);
  }

  @Test
  void testUpdateCashRegisterSuccess() throws Exception {
    // Given
    CashRegister mockCashRegisters = createCashRegisterEntity(UUID.randomUUID());

    RequestUpdateCashRegister updateRequest = createRequestUpdateCashRegister(mockCashRegisters.getUuid());

    mockCashRegisters.updateCashRegister(updateRequest);
    ResponseCashRegister expectedResponse = new ResponseCashRegister(mockCashRegisters);

    when(service.updateCashRegister(updateRequest)).thenReturn(mockCashRegisters);

    // When & Then
    mockMvc.perform(put("/registers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(updateRequest)))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).updateCashRegister(updateRequest);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testDeleteCashRegisterSuccess() throws Exception {
    // Given
    UUID cashRegisterUuid = UUID.randomUUID();
    doNothing().when(service).deleteCashRegister(cashRegisterUuid);

    // When & Then
    mockMvc.perform(delete("/registers/{uuid}", cashRegisterUuid)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNoContent());

    // Verify interactions
    verify(service, times(1)).deleteCashRegister(cashRegisterUuid);
    verifyNoMoreInteractions(service);
  }
}
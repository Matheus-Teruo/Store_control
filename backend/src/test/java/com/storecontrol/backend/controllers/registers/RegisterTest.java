package com.storecontrol.backend.controllers.registers;

import com.storecontrol.backend.BaseTest;
import com.storecontrol.backend.models.registers.Register;
import com.storecontrol.backend.models.registers.request.RequestCreateRegister;
import com.storecontrol.backend.models.registers.request.RequestUpdateRegister;
import com.storecontrol.backend.models.registers.response.ResponseRegister;
import com.storecontrol.backend.models.registers.response.ResponseSummaryRegister;
import com.storecontrol.backend.services.registers.RegisterService;
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

class RegisterTest extends BaseTest {

  @MockBean
  private RegisterService service;

  @Test
  void testCreateRegister() throws Exception {
    // Given
    Register mockRegister = createRegisterEntity(UUID.randomUUID());
    RequestCreateRegister requestStand = createRequestCreateRegister(mockRegister);
    ResponseRegister expectedResponse = new ResponseRegister(mockRegister);

    when(service.createRegister(requestStand)).thenReturn(mockRegister);

    // When & Then
    mockMvc.perform(post("/registers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(requestStand)))
        .andExpect(status().isCreated())
        .andExpect(header().string("Location",
            containsString("/registers/" + mockRegister.getUuid().toString())))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).createRegister(requestStand);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadRegisterSuccess() throws Exception {
    // Given
    UUID registerUuid = UUID.randomUUID();

    Register mockRegister = createRegisterEntity(registerUuid);
    ResponseRegister expectedResponse = new ResponseRegister(mockRegister);

    when(service.takeRegisterByUuid(registerUuid)).thenReturn(mockRegister);

    // When & Then
    mockMvc.perform(get("/registers/{uuid}", registerUuid)
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).takeRegisterByUuid(registerUuid);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadRegistersSuccess() throws Exception {
    // Given
    List<Register> mockRegisters = List.of(
        createRegisterEntity(UUID.randomUUID()),
        createRegisterEntity(UUID.randomUUID())
    );
    Page<Register> mockPage = new PageImpl<>(mockRegisters);
    Page<ResponseSummaryRegister> expectedResponse = mockPage
        .map(ResponseSummaryRegister::new);

    when(service.pageRegisters(any(Pageable.class))).thenReturn(mockPage);

    // When & Then
    mockMvc.perform(get("/registers")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).pageRegisters(any(Pageable.class));
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadListRegistersSuccess() throws Exception {
    // Given
    List<Register> mockRegisters = List.of(
        createRegisterEntity(UUID.randomUUID()),
        createRegisterEntity(UUID.randomUUID())
    );
    List<ResponseSummaryRegister> expectedResponse = mockRegisters.stream()
        .map(ResponseSummaryRegister::new)
        .toList();

    when(service.listRegisters()).thenReturn(mockRegisters);

    // When & Then
    mockMvc.perform(get("/registers/list")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).listRegisters();
    verifyNoMoreInteractions(service);
  }

  @Test
  void testUpdateRegisterSuccess() throws Exception {
    // Given
    Register mockRegisters = createRegisterEntity(UUID.randomUUID());

    RequestUpdateRegister updateRequest = createRequestUpdateRegister(mockRegisters.getUuid());

    mockRegisters.updateRegister(updateRequest);
    ResponseRegister expectedResponse = new ResponseRegister(mockRegisters);

    when(service.updateRegister(updateRequest)).thenReturn(mockRegisters);

    // When & Then
    mockMvc.perform(put("/registers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(updateRequest)))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).updateRegister(updateRequest);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testDeleteRegisterSuccess() throws Exception {
    // Given
    UUID registerUuid = UUID.randomUUID();
    doNothing().when(service).deleteRegister(registerUuid);

    // When & Then
    mockMvc.perform(delete("/registers/{uuid}", registerUuid)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNoContent());

    // Verify interactions
    verify(service, times(1)).deleteRegister(registerUuid);
    verifyNoMoreInteractions(service);
  }
}
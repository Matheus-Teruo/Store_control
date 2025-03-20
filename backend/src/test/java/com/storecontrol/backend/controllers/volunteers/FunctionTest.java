package com.storecontrol.backend.controllers.volunteers;

import com.storecontrol.backend.BaseTest;
import com.storecontrol.backend.models.volunteers.Function;
import com.storecontrol.backend.models.volunteers.response.ResponseSummaryFunction;
import com.storecontrol.backend.services.volunteers.FunctionService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.createFunctionEntity;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class FunctionTest extends BaseTest {

  @MockBean
  private FunctionService service;

  @Test
  void testReadListFunctionsSuccess() throws Exception {
    // Given
    List<Function> mockFunction = List.of(
        createFunctionEntity(UUID.randomUUID()),
        createFunctionEntity(UUID.randomUUID())
    );
    List<ResponseSummaryFunction> expectedResponse = mockFunction.stream()
        .map(ResponseSummaryFunction::new)
        .toList();

    when(service.listFunctions()).thenReturn(mockFunction);

    // When & Then
    mockMvc.perform(get("/functions")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).listFunctions();
    verifyNoMoreInteractions(service);
  }
}

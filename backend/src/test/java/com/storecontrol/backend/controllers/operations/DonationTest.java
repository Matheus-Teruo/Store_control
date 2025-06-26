package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.BaseTest;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.customers.Card;
import com.storecontrol.backend.models.operations.finalization.Donation;
import com.storecontrol.backend.models.operations.finalization.response.ResponseDonation;
import com.storecontrol.backend.models.operations.finalization.response.ResponseSummaryDonation;
import com.storecontrol.backend.services.operations.DonationService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class DonationTest extends BaseTest {

  @MockBean
  private DonationService service;

  @Test
  void testReadDonationSuccess() throws Exception {
    // Given
    UUID donationUuid = UUID.randomUUID();

    String cardId = "CardIDTest12345";
    Card mockCard = createCardEntity(cardId, false);
    Customer mockCustomer = createCustomerEntity(UUID.randomUUID(), mockCard,false);
    Donation mockDonation = createDonationEntity(donationUuid, mockCustomer);

    ResponseDonation expectedResponse = new ResponseDonation(mockDonation);

    when(service.takeDonationByUuid(donationUuid)).thenReturn(mockDonation);

    // When & Then
    mockMvc.perform(get("/donations/{uuid}", donationUuid)
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).takeDonationByUuid(donationUuid);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadDonationsSuccess() throws Exception {
    // Given
    String cardId1 = "CardIDTest12345";
    Card mockCard1 = createCardEntity(cardId1, true);
    Customer mockCustomer1 = createCustomerEntity(UUID.randomUUID(), mockCard1,false);
    Customer mockCustomer2 = createCustomerEntity(UUID.randomUUID(), mockCard1,false);
    List<Donation> mockDonations = List.of(
        createDonationEntity(UUID.randomUUID(), mockCustomer1),
        createDonationEntity(UUID.randomUUID(), mockCustomer2)
    );
    Page<Donation> mockPage = new PageImpl<>(mockDonations);
    Page<ResponseSummaryDonation> expectedResponse = mockPage
        .map(ResponseSummaryDonation::new);

    when(service.pageDonations(any(Pageable.class))).thenReturn(mockPage);

    // When & Then
    mockMvc.perform(get("/donations")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).pageDonations(any(Pageable.class));
    verifyNoMoreInteractions(service);
  }
}
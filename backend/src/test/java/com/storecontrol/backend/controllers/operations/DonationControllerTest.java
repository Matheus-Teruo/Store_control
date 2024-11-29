package com.storecontrol.backend.controllers.operations;

import com.storecontrol.backend.BaseControllerTest;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.customers.OrderCard;
import com.storecontrol.backend.models.operations.Donation;
import com.storecontrol.backend.models.operations.response.ResponseDonation;
import com.storecontrol.backend.models.operations.response.ResponseSummaryDonation;
import com.storecontrol.backend.models.stands.Association;
import com.storecontrol.backend.models.stands.response.ResponseSummaryAssociation;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.services.operations.DonationService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

class DonationControllerTest extends BaseControllerTest {

  @MockBean
  DonationService service;

  @Test
  void testReadDonationSuccess() throws Exception {
    // Given
    UUID donationUuid = UUID.randomUUID();

    String cardId = "CardIDTest12345";
    OrderCard mockOrderCard = createOrderCardEntity(cardId, false);
    Customer mockCustomer = createCustomerEntity(UUID.randomUUID(), mockOrderCard,false);
    Donation mockDonation = createDonationEntity(donationUuid, mockCustomer);

    ResponseDonation expectedResponse = new ResponseDonation(mockDonation);

    when(service.takeDonationByUuid(donationUuid)).thenReturn(mockDonation);

    // When
    String jsonResponse = performGetWithVariablePath("donations", donationUuid);

    // Then
    ResponseDonation actualResponse = fromJson(jsonResponse, ResponseDonation.class);
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).takeDonationByUuid(donationUuid);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadDonationsSuccess() throws Exception {
    // Given
    String cardId1 = "CardIDTest12345";
    OrderCard mockOrderCard1 = createOrderCardEntity(cardId1, true);
    Customer mockCustomer1 = createCustomerEntity(UUID.randomUUID(), mockOrderCard1,false);
    Customer mockCustomer2 = createCustomerEntity(UUID.randomUUID(), mockOrderCard1,false);
    List<Donation> mockDonations = List.of(
        createDonationEntity(UUID.randomUUID(), mockCustomer1),
        createDonationEntity(UUID.randomUUID(), mockCustomer2)
    );
    List<ResponseSummaryDonation> expectedResponse = mockDonations.stream()
        .map(ResponseSummaryDonation::new)
        .toList();

    when(service.listDonations()).thenReturn(mockDonations);

    // When
    String jsonResponse = performGetList("donations")
        .andExpect(jsonPath("$.length()").value(2))
        .andReturn().getResponse().getContentAsString();

    // Then
    List<ResponseSummaryDonation> actualResponse = List.of(fromJson(jsonResponse, ResponseSummaryDonation[].class));
    assertEquals(expectedResponse, actualResponse);

    // Verify interactions
    verify(service, times(1)).listDonations();
    verifyNoMoreInteractions(service);
  }
}
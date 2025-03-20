package com.storecontrol.backend.models.operations.response;

import com.storecontrol.backend.models.customers.response.ResponseSummaryCustomer;
import com.storecontrol.backend.models.volunteers.response.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.operations.Donation;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseDonation(
    UUID uuid,
    BigDecimal donationValue,
    String donationTimeStamp,
    ResponseSummaryCustomer summaryCustomer,
    ResponseSummaryVoluntary summaryVoluntary
) {

  public ResponseDonation(Donation donation) {
    this(donation.getUuid(),
        donation.getDonationValue(),
        donation.getDonationTimeStamp().toString(),
        new ResponseSummaryCustomer(donation.getCustomer()),
        new ResponseSummaryVoluntary(donation.getVoluntary())
    );
  }
}

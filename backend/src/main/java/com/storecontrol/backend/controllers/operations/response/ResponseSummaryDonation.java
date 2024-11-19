package com.storecontrol.backend.controllers.operations.response;

import com.storecontrol.backend.controllers.volunteers.response.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.operations.Donation;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseSummaryDonation(
    UUID uuid,
    BigDecimal donationValue,
    String donationTimeStamp,
    ResponseSummaryVoluntary summaryVoluntary
) {

  public ResponseSummaryDonation(Donation donation) {
    this(donation.getUuid(),
        donation.getDonationValue(),
        donation.getDonationTimeStamp().toString(),
        new ResponseSummaryVoluntary(donation.getVoluntary())
    );
  }
}

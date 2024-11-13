package com.storecontrol.backend.controllers.response.donation;

import com.storecontrol.backend.controllers.response.voluntary.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.Donation;

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

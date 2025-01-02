package com.storecontrol.backend.models.operations.response;

import com.storecontrol.backend.models.operations.Donation;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseSummaryDonation(
    UUID uuid,
    BigDecimal donationValue,
    String donationTimeStamp,
    UUID summaryVoluntary
) {

  public ResponseSummaryDonation(Donation donation) {
    this(donation.getUuid(),
        donation.getDonationValue(),
        donation.getDonationTimeStamp().toString(),
        donation.getVoluntaryUuid()
    );
  }
}

package com.storecontrol.backend.controllers.response.donation;

import com.storecontrol.backend.controllers.response.customer.ResponseSummaryCustomer;
import com.storecontrol.backend.controllers.response.voluntary.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.Donation;

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

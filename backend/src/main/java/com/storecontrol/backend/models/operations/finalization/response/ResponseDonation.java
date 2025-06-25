package com.storecontrol.backend.models.operations.finalization.response;

import com.storecontrol.backend.models.customers.response.ResponseSummaryCustomer;
import com.storecontrol.backend.models.volunteers.response.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.operations.finalization.Donation;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseDonation(
    UUID uuid,
    BigDecimal donationValue,
    String donationTimestamp,
    ResponseSummaryCustomer summaryCustomer,
    ResponseSummaryVoluntary summaryVoluntary
) {

  public ResponseDonation(Donation donation) {
    this(donation.getUuid(),
        donation.getDonationValue(),
        donation.getDonationTimestamp().toString(),
        new ResponseSummaryCustomer(donation.getCustomer()),
        new ResponseSummaryVoluntary(donation.getVoluntary())
    );
  }
}

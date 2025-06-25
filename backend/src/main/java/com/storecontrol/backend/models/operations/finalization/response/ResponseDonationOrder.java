package com.storecontrol.backend.models.operations.finalization.response;

import com.storecontrol.backend.models.operations.finalization.Donation;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseDonationOrder(
    UUID uuid,
    BigDecimal donationValue,
    String donationTimestamp
) {

  public ResponseDonationOrder(Donation donation) {
    this(donation.getUuid(),
        donation.getDonationValue(),
        donation.getDonationTimestamp().toString()
    );
  }
}

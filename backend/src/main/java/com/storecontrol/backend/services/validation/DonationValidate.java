package com.storecontrol.backend.services.validation;

import com.storecontrol.backend.controllers.request.donation.RequestDonation;
import com.storecontrol.backend.models.Customer;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DonationValidate {

  public void checkInsufficientDebitToDonate(RequestDonation request, Customer customer) {
    var donationValue = new BigDecimal(request.donationValue());
    var currentDebit = customer.getOrderCard().getDebit();

    if (currentDebit.compareTo(BigDecimal.ZERO) > 0 && donationValue.compareTo(currentDebit) == 0) {
      // TODO: error: insufficient balance or remaind credit to nothing
    }
  }
}

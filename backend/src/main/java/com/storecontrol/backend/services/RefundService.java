package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.donation.RequestDonation;
import com.storecontrol.backend.controllers.request.refund.RequestRefund;
import com.storecontrol.backend.controllers.response.customer.ResponseSummaryCustomer;
import com.storecontrol.backend.controllers.response.refund.ResponseRefund;
import com.storecontrol.backend.controllers.response.voluntary.ResponseSummaryVoluntary;
import com.storecontrol.backend.services.validation.RefundValidate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class RefundService {

  @Autowired
  RefundValidate validate;

  @Autowired
  CustomerService customerService;

  @Autowired
  DonationService donationService;

  @Autowired
  VoluntaryService voluntaryService;

  public ResponseRefund createRefund(RequestRefund request) {
    var customer = customerService.takeActiveCustomerByCardId(request.orderCardId());
    var remainingDebit = customer.getOrderCard().getDebit();
    var refundValue = new BigDecimal(request.refundValue());

    boolean donationCreated = false;
    if (remainingDebit.compareTo(BigDecimal.ZERO) > 0) {
      validate.checkRefundValueValid(refundValue, remainingDebit, customer);

      customer.getOrderCard().incrementDebit(refundValue.negate());
      if (remainingDebit.compareTo(refundValue) > 0) {
        donationService.createDonation(
            new RequestDonation(
                remainingDebit.subtract(refundValue).toString(),
                request.orderCardId(),
                request.voluntaryId()));
        donationCreated = true;
      }
    }

    if (!donationCreated) {
      customerService.finalizeCustomer(request.orderCardId());
    }

    return new ResponseRefund(
        refundValue,
        new ResponseSummaryCustomer(customer),
        new ResponseSummaryVoluntary(voluntaryService.takeVoluntaryByUuid(request.voluntaryId())));
  }
}

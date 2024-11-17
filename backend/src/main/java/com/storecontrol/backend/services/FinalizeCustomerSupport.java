package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.customer.RequestAuxFinalizeCustomer;
import com.storecontrol.backend.controllers.request.customer.RequestCustomer;
import com.storecontrol.backend.controllers.response.customer.ResponseCustomer;
import com.storecontrol.backend.models.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class FinalizeCustomerSupport {

  @Autowired
  CustomerService customerService;

  @Autowired
  VoluntaryService voluntaryService;

  @Autowired
  RefundService refundService;

  @Autowired
  DonationService donationService;

  public Customer finalizeCustomer(RequestAuxFinalizeCustomer request) {
    var voluntary = voluntaryService.takeVoluntaryByUuid(request.voluntaryId());
    var customer = customerService.takeActiveFilteredCustomerByCardId(request.orderCardId());
    var remainingDebit = customer.getOrderCard().getDebit();

    if (remainingDebit.compareTo(BigDecimal.ZERO) > 0) {
      if (new BigDecimal(request.refundValue())
          .add(new BigDecimal(request.donationValue()))
          .compareTo(remainingDebit) == 0) {
        if (new BigDecimal(request.donationValue()).compareTo(BigDecimal.ZERO) > 0) {
          donationService.createDonation(request, customer, voluntary);
        }
        if (new BigDecimal(request.refundValue()).compareTo(BigDecimal.ZERO) > 0) {
          refundService.createRefund(request, customer, voluntary);
        }
      } // else
        // TODO: error, this will result in a donation value different
    }

    customerService.finalizeCustomer(customer);
    return customer;
  }

  public Customer undoFinalizeCustomer(RequestCustomer request) {
    var customer = customerService.takeLastActiveFilteredCustomerByCardId(request.orderCard().id());

    if (!customer.getInUse()) {
      if (!customer.getDonations().isEmpty()) {
        donationService.deleteDonation(customer);
      }
      if (!customer.getRefunds().isEmpty()) {
        refundService.deleteRefund(customer);
      }

      customerService.undoFinalizeCustomer(customer);
    } // else
      // TODO: error: customer not finalized to undo it.

    return customer;
  }
}

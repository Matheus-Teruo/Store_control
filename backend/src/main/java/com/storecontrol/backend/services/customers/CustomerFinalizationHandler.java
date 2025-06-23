package com.storecontrol.backend.services.customers;

import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.customers.request.RequestCustomerFinalization;
import com.storecontrol.backend.models.customers.request.RequestOrderCard;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.services.customers.component.CustomerFinalizationValidation;
import com.storecontrol.backend.services.operations.DonationService;
import com.storecontrol.backend.services.operations.RefundService;
import com.storecontrol.backend.services.registers.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class CustomerFinalizationHandler {

  @Autowired
  private CustomerFinalizationValidation validation;

  @Autowired
  private CustomerService customerService;

  @Autowired
  private RegisterService registerService;

  @Autowired
  private RefundService refundService;

  @Autowired
  private DonationService donationService;

  public Customer finalizeCustomer(RequestCustomerFinalization request) {
    Voluntary voluntary = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    var register = registerService.safeTakeRegisterByUuid(request.registerUuid());
    var customer = customerService.takeActiveFilteredCustomerByCardId(request.orderCardId());
    var remainingDebit = customer.getOrderCard().getDebit();

    validation.checkVoluntaryFunctionMatch(register, voluntary);

    if (remainingDebit.compareTo(BigDecimal.ZERO) > 0) {
      validation.checkRemainingDebitMatchTotalDonationAndRefund(request.donationValue(), request.refundValue(), remainingDebit);
      if (request.refundValue().compareTo(BigDecimal.ZERO) > 0) {
        refundService.createRefund(request, customer, register, voluntary);
      }
      if (request.donationValue().compareTo(BigDecimal.ZERO) > 0) {
        donationService.createDonation(request, customer, register, voluntary);
      }
    }

    customerService.finalizeCustomer(customer);
    return customer;
  }

  public Customer undoFinalizeCustomer(RequestOrderCard request) {
    var customer = customerService.takeLastActiveFilteredCustomerByCardId(request.cardId());
    Voluntary voluntary = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    validation.checkVoluntaryFunctionType(voluntary);
    validation.checkCardHaveACustomerInUse(customer);

    if (!customer.getDonations().isEmpty()) {
      donationService.deleteDonation(customer);
    }
    if (!customer.getRefunds().isEmpty()) {
      refundService.deleteRefund(customer);
    }

    customerService.undoFinalizeCustomer(customer);

    return customer;
  }
}

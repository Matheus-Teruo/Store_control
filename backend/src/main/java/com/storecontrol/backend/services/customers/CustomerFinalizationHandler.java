package com.storecontrol.backend.services.customers;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidCustomerException;
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
      if (request.refundValue()
          .add(request.donationValue())
          .compareTo(remainingDebit) == 0) {
        if (request.refundValue().compareTo(BigDecimal.ZERO) > 0) {
          refundService.createRefund(request, customer, register, voluntary);
        }
        if (request.donationValue().compareTo(BigDecimal.ZERO) > 0) {
          donationService.createDonation(request, customer, register, voluntary);
        }
      } else {
        throw new InvalidCustomerException(
            MessageResolver.getInstance().getMessage("service.exception.customerFinalization.finalization.validation.error"),
            MessageResolver.getInstance().getMessage("service.exception.customerFinalization.finalization.validation.message")
        );
      }
    }

    customerService.finalizeCustomer(customer);
    return customer;
  }

  public Customer undoFinalizeCustomer(RequestOrderCard request, boolean fromRegister) {
    var customer = customerService.takeLastActiveFilteredCustomerByCardId(request.cardId());

    if (fromRegister) {
      Voluntary voluntary = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
      validation.checkVoluntaryFunctionType(voluntary);
    }

    if (!customer.isInUse()) {
      if (!customer.getDonations().isEmpty()) {
        donationService.deleteDonation(customer);
      }
      if (!customer.getRefunds().isEmpty()) {
        refundService.deleteRefund(customer);
      }

      customerService.undoFinalizeCustomer(customer);
    } else {
      throw new InvalidCustomerException(
          MessageResolver.getInstance().getMessage("service.exception.customerFinalization.undoFinalization.validation.error"),
          MessageResolver.getInstance().getMessage("service.exception.customerFinalization.undoFinalization.validation.message")
      );
    }

    return customer;
  }
}

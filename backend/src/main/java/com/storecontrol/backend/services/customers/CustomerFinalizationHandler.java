package com.storecontrol.backend.services.customers;

import com.storecontrol.backend.infra.exceptions.InvalidCustomerException;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.customers.request.RequestCustomerFinalization;
import com.storecontrol.backend.models.customers.request.RequestOrderCard;
import com.storecontrol.backend.services.customers.component.CustomerFinalizationValidation;
import com.storecontrol.backend.services.operations.DonationService;
import com.storecontrol.backend.services.operations.RefundService;
import com.storecontrol.backend.services.registers.CashRegisterService;
import com.storecontrol.backend.services.volunteers.VoluntaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

@Component
public class CustomerFinalizationHandler {

  @Autowired
  CustomerFinalizationValidation validation;

  @Autowired
  CustomerService customerService;

  @Autowired
  CashRegisterService cashRegisterService;

  @Autowired
  VoluntaryService voluntaryService;

  @Autowired
  RefundService refundService;

  @Autowired
  DonationService donationService;

  public Customer finalizeCustomer(RequestCustomerFinalization request, UUID userUuid) {
    var voluntary = voluntaryService.safeTakeVoluntaryByUuid(userUuid);
    var cashRegister = cashRegisterService.safeTakeCashRegisterByUuid(request.cashRegisterUuid());
    var customer = customerService.takeActiveFilteredCustomerByCardId(request.orderCardId());
    var remainingDebit = customer.getOrderCard().getDebit();

    validation.checkVoluntaryFunctionMatch(cashRegister, voluntary);

    if (remainingDebit.compareTo(BigDecimal.ZERO) > 0) {
      if (request.refundValue()
          .add(request.donationValue())
          .compareTo(remainingDebit) == 0) {
        if (request.refundValue().compareTo(BigDecimal.ZERO) > 0) {
          refundService.createRefund(request, customer, cashRegister, voluntary);
        }
        if (request.donationValue().compareTo(BigDecimal.ZERO) > 0) {
          donationService.createDonation(request, customer, voluntary);
        }
      } else {
        throw new InvalidCustomerException("Customer finalization", "Sum of donation and refund is not equal remaining debit");
      }
    }

    customerService.finalizeCustomer(customer);
    return customer;
  }

  public Customer undoFinalizeCustomer(RequestOrderCard request, UUID userUuid) {
    var customer = customerService.takeLastActiveFilteredCustomerByCardId(request.cardId());
    var voluntary = voluntaryService.safeTakeVoluntaryByUuid(userUuid);

    validation.checkVoluntaryFunctionType(voluntary);

    if (!customer.isInUse()) {
      if (!customer.getDonations().isEmpty()) {
        donationService.deleteDonation(customer);
      }
      if (!customer.getRefunds().isEmpty()) {
        refundService.deleteRefund(customer);
      }

      customerService.undoFinalizeCustomer(customer);
    } else {
      throw new InvalidCustomerException("Undo customer finalization", "Customer still in use");
    }

    return customer;
  }
}

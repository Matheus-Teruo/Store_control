package com.storecontrol.backend.services.operations;

import com.storecontrol.backend.models.customers.request.RequestAuxFinalizeCustomer;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.operations.Refund;
import com.storecontrol.backend.models.registers.CashRegister;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.repositories.operations.RefundRepository;
import com.storecontrol.backend.services.validation.FinalizationOfCustomerValidate;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class RefundService {

  @Autowired
  RefundRepository repository;

  @Autowired
  FinalizationOfCustomerValidate validate;

  @Transactional
  public void createRefund(RequestAuxFinalizeCustomer request,
                           Customer customer,
                           CashRegister cashRegister,
                           Voluntary voluntary) {
    var refundValue = new BigDecimal(request.refundValue());

    validate.checkRefundValueValid(refundValue, customer);

    customer.getOrderCard().incrementDebit(refundValue.negate());
    cashRegister.incrementCash(refundValue.negate());
    var refund = new Refund(request, customer, cashRegister, voluntary);
    customer.setRefunds(List.of(refund));

    repository.save(refund);
  }

  public Refund takeRefundByUuid(String uuid) {
    var refundOptional = repository.findByUuidValidTrue(UUID.fromString(uuid));

    return refundOptional.orElseGet(Refund::new);  // TODO: ERROR: donation_uuid invalid
  }

  public List<Refund> listRefunds() {
    return repository.findAllValidTrue();
  }

  @Transactional
  public void deleteRefund(Customer customer) {
    var refund = customer.getRefunds().getFirst();
    customer.getOrderCard().incrementDebit(refund.getRefundValue());
    refund.getCashRegister().incrementCash(refund.getRefundValue());

    refund.deleteRefund();
  }
}

package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.customer.RequestAuxFinalizeCustomer;
import com.storecontrol.backend.models.Customer;
import com.storecontrol.backend.models.Refund;
import com.storecontrol.backend.models.Voluntary;
import com.storecontrol.backend.repositories.RefundRepository;
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
  public void createRefund(RequestAuxFinalizeCustomer request, Customer customer, Voluntary voluntary) {
    var refundValue = new BigDecimal(request.refundValue());

    validate.checkRefundValueValid(refundValue, customer);

    customer.getOrderCard().incrementDebit(refundValue.negate());
    var refund = new Refund(request, customer, voluntary);
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
    customer.getOrderCard().incrementDebit(customer.getRefunds().getFirst().getRefundValue());

    customer.getRefunds().getFirst().deleteRefund();
  }
}

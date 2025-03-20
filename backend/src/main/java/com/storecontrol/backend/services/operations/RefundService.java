package com.storecontrol.backend.services.operations;

import com.storecontrol.backend.models.customers.request.RequestCustomerFinalization;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.operations.Refund;
import com.storecontrol.backend.models.registers.CashRegister;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.repositories.operations.RefundRepository;
import com.storecontrol.backend.services.customers.component.CustomerFinalizationValidation;
import com.storecontrol.backend.services.operations.validation.RefundValidation;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class RefundService {

  @Autowired
  RefundValidation validation;

  @Autowired
  RefundRepository repository;

  @Autowired
  CustomerFinalizationValidation finalizationValidation;

  @Transactional
  public void createRefund(RequestCustomerFinalization request,
                           Customer customer,
                           CashRegister cashRegister,
                           Voluntary voluntary) {
    var refundValue = request.refundValue();

    validation.checkVoluntaryFunctionMatch(voluntary);
    finalizationValidation.checkRefundValueValid(refundValue, customer);

    customer.getOrderCard().incrementDebit(refundValue.negate());
    cashRegister.incrementCash(refundValue.negate());
    var refund = new Refund(request, customer, cashRegister, voluntary);
    customer.setRefunds(List.of(refund));

    repository.save(refund);
  }

  public Refund takeRefundByUuid(UUID uuid) {
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(EntityNotFoundException::new);
  }

  public Page<Refund> pageRefunds(Pageable pageable) {
    return repository.findAllValidTrue(pageable);
  }

  @Transactional
  public void deleteRefund(Customer customer) {
    var refund = customer.getRefunds().getFirst();
    customer.getOrderCard().incrementDebit(refund.getRefundValue());
    refund.getCashRegister().incrementCash(refund.getRefundValue());

    refund.deleteRefund();
  }
}

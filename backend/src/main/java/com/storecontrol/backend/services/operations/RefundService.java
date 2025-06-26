package com.storecontrol.backend.services.operations;

import com.storecontrol.backend.models.customers.request.RequestCustomerFinalization;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.operations.finalization.Refund;
import com.storecontrol.backend.models.registers.Register;
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
  private RefundValidation validation;

  @Autowired
  private RefundRepository repository;

  @Autowired
  private CustomerFinalizationValidation finalizationValidation;

  @Transactional
  public void createRefund(RequestCustomerFinalization request,
                           Customer customer,
                           Register register,
                           Voluntary voluntary) {
    var refundValue = request.refundValue();

    validation.checkVoluntaryFunctionMatch(voluntary);
    finalizationValidation.checkRefundValueValid(refundValue, customer);

    customer.getCard().incrementDebit(refundValue.negate());
    register.incrementCash(refundValue.negate());
    var refund = new Refund(request, customer, register, voluntary);
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
    customer.getCard().incrementDebit(refund.getRefundValue());
    refund.getRegister().incrementCash(refund.getRefundValue());

    refund.deleteRefund();
  }
}

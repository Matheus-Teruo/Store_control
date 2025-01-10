package com.storecontrol.backend.services.operations;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.enumerate.PaymentType;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.operations.request.RequestCreateRecharge;
import com.storecontrol.backend.repositories.operations.RechargeRepository;
import com.storecontrol.backend.services.customers.CustomerService;
import com.storecontrol.backend.services.operations.validation.RechargeValidation;
import com.storecontrol.backend.services.registers.CashRegisterService;
import com.storecontrol.backend.services.volunteers.VoluntaryService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class RechargeService {

  @Autowired
  RechargeValidation validation;

  @Autowired
  RechargeRepository repository;

  @Autowired
  VoluntaryService voluntaryService;

  @Autowired
  CashRegisterService cashRegisterService;

  @Autowired
  CustomerService customerService;

  @Transactional
  public Recharge createRecharge(RequestCreateRecharge request, UUID userUuid) {
    var voluntary = voluntaryService.safeTakeVoluntaryByUuid(userUuid);
    var cashRegister = cashRegisterService.safeTakeCashRegisterByUuid(request.cashRegisterUuid());

    validation.checkVoluntaryFunctionMatch(cashRegister, voluntary);

    var customer = handleChangesOnCustomerByCardId(request);
    customer.getOrderCard().incrementDebit(request.rechargeValue());

    var recharge = new Recharge(request, customer, cashRegister, voluntary);
    handleCashTotal(recharge, recharge.getPaymentTypeEnum(), false);

    repository.save(recharge);

    return recharge;
  }

  public Recharge takeRechargeByUuid(UUID uuid) {
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(EntityNotFoundException::new);
  }

  public Recharge safeTakeRechargeByUuid(UUID uuid) {
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(() -> new InvalidDatabaseQueryException(
            MessageResolver.getInstance().getMessage("service.exception.recharge.get.validation.error"),
            MessageResolver.getInstance().getMessage("service.exception.recharge.get.validation.message"),
            uuid.toString())
        );
  }

  public Page<Recharge> pageRecharges(Pageable pageable) {
    return repository.findAllValidTrue(pageable);
  }

  public List<Recharge> listLast3Purchases(UUID voluntaryUuid) {
    return repository.findLast3ValidTrue(voluntaryUuid);
  }

  @Transactional
  public void deleteRecharge(UUID uuid, UUID userUuid) {
    var recharge = safeTakeRechargeByUuid(uuid);
    var voluntary = voluntaryService.safeTakeVoluntaryByUuid(userUuid);

    validation.checkDebitRemainderPositive(recharge);
    validation.checkRechargeBelongsToVoluntary(recharge, userUuid);
    validation.checkIfLastRechargeOfVoluntary(recharge, voluntary);

    recharge.getCustomer().getOrderCard().incrementDebit(recharge.getRechargeValue().negate());
    handleCashTotal(recharge, recharge.getPaymentTypeEnum(), true);

    recharge.deleteRecharge();
    handleFilterFinalizeCustomer(recharge.getCustomer());
  }

  private Customer handleChangesOnCustomerByCardId(RequestCreateRecharge request) {
    Customer customer;
    try {
      customer = customerService.takeActiveCustomerByCardId(request.orderCardId());
    } catch (InvalidDatabaseQueryException ex) {
      customer = customerService.initializeCustomer(request.orderCardId());
    }
    return customer;
  }

  private void handleFilterFinalizeCustomer(Customer customer) {
    var recharges = customer.getRecharges().stream()
        .filter(Recharge::isValid)
        .toList();

    if (recharges.isEmpty()) {
      customerService.finalizeCustomer(customer);
    }
  }

  private void handleCashTotal(Recharge recharge, PaymentType paymentType, Boolean isReversal) {

    BigDecimal adjustmentFactor = isReversal ? BigDecimal.ONE.negate() : BigDecimal.ONE;
    var rechargeValue = recharge.getRechargeValue().multiply(adjustmentFactor);

    switch(paymentType) {
      case PaymentType.CASH:
        recharge.getCashRegister().incrementCash(rechargeValue);
        break;
      case PaymentType.CREDIT:
        recharge.getCashRegister().incrementCredit(rechargeValue);
        break;
      case PaymentType.DEBIT:
        recharge.getCashRegister().incrementDebit(rechargeValue);
        break;
    }
  }
}

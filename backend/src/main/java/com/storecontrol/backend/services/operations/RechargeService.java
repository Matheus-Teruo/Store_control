package com.storecontrol.backend.services.operations;

import com.storecontrol.backend.models.customers.request.RequestCustomer;
import com.storecontrol.backend.models.customers.request.RequestUpdateOrderCard;
import com.storecontrol.backend.models.operations.request.RequestRecharge;
import com.storecontrol.backend.models.operations.request.RequestUpdateRecharge;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.enumerate.PaymentType;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.repositories.operations.RechargeRepository;
import com.storecontrol.backend.services.registers.CashRegisterService;
import com.storecontrol.backend.services.volunteers.VoluntaryService;
import com.storecontrol.backend.services.customers.CustomerService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class RechargeService {

  @Autowired
  RechargeRepository repository;

  @Autowired
  VoluntaryService voluntaryService;

  @Autowired
  CashRegisterService cashRegisterService;

  @Autowired
  CustomerService customerService;

  @Transactional
  public Recharge createRecharge(RequestRecharge request) {
    var voluntary = voluntaryService.takeVoluntaryByUuid(request.voluntaryId());
    var cashRegister = cashRegisterService.takeCashRegisterByUuid(request.cashRegisterId());
    var customer = handleChangesOnCustomerByCardId(request);

    var recharge = new Recharge(request, customer, cashRegister, voluntary);
    handleCashTotal(recharge, recharge.getPaymentTypeEnum(), false);
    repository.save(recharge);

    return recharge;
  }

  public Recharge takeRechargeByUuid(String uuid) {
    var rechargeOptional = repository.findByUuidValidTrue(UUID.fromString(uuid));

    return rechargeOptional.orElseGet(Recharge::new);  // TODO: ERROR: recharge_uuid invalid
  }

  public List<Recharge> listRecharges() {
    return repository.findAllValidTrue();
  }

  @Transactional
  public Recharge updateRecharge(RequestUpdateRecharge request) {
    var recharge = takeRechargeByUuid(request.uuid());

    if (request.paymentTypeEnum() != null) {
      recharge.updateRecharge(request);
    }

    return recharge;
  }

  @Transactional
  public void deleteRecharge(RequestUpdateRecharge request) {
    var recharge = takeRechargeByUuid(request.uuid());

    handleUndoCustomerDebit(recharge);
    handleCashTotal(recharge, recharge.getPaymentTypeEnum(), true);

    recharge.deleteRecharge();
    handleFinalizeCustomer(recharge.getCustomer());
  }

  private Customer handleChangesOnCustomerByCardId(RequestRecharge request) {
    Customer customer;
    try {
      customer = customerService.takeActiveCustomerByCardId(request.orderCardId());
      customer.getOrderCard().incrementDebit(new BigDecimal(request.rechargeValue()));
    } catch (RuntimeException e) {  // TODO: handle error of customer non-existence (change generic Exception )
      customer = customerService.initializeCustomer(
          new RequestCustomer(
              new RequestUpdateOrderCard(
                  request.orderCardId(),
                  request.rechargeValue())
          )
      );
    }
    return customer;
  }

  private void handleFinalizeCustomer(Customer customer) {
    var recharges = customer.getRecharges().stream()
        .filter(Recharge::isValid)
        .toList();

    if (recharges.isEmpty()) {
      customerService.finalizeCustomer(customer);
    }
  }

  private void handleUndoCustomerDebit(Recharge recharge) {
    var rechargeValue = recharge.getRechargeValue();
    var currentDebit = recharge.getCustomer().getOrderCard().getDebit();

    if (rechargeValue.compareTo(currentDebit) <= 0 ) {
      recharge.getCustomer().getOrderCard().incrementDebit(rechargeValue.negate());
    }
    // TODO: error: can't delete recharge and result a negative debit in OrderCard
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

package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.customer.RequestCustomer;
import com.storecontrol.backend.controllers.request.orderCard.RequestUpdateOrderCard;
import com.storecontrol.backend.controllers.request.recharge.RequestRecharge;
import com.storecontrol.backend.controllers.request.recharge.RequestUpdateRecharge;
import com.storecontrol.backend.models.Customer;
import com.storecontrol.backend.models.Recharge;
import com.storecontrol.backend.repositories.RechargeRepository;
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
  CustomerService customerService;

  @Transactional
  public Recharge createRecharge(RequestRecharge request) {
    var voluntary = voluntaryService.takeVoluntaryByUuid(request.voluntaryId());
    var customer = handleChangesOnCustomerByCardId(request);

    var recharge = new Recharge(request, customer, voluntary);
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

    recharge.deleteRecharge();
    handleFinalizeCustomer(recharge.getCustomer());
  }

  private Customer handleChangesOnCustomerByCardId(RequestRecharge request) {
    Customer customer;
    try {
      customer = customerService.takeActiveCustomerByCardId(request.orderCardId());
      customer.getOrderCard().incrementDebit(new BigDecimal(request.rechargeValue()));
    } catch (RuntimeException e) {  // TODO: handle error of customer non-existence (change the Exception generic)
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
        .filter(Recharge::getValid)
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
}

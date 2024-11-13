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

  @Autowired
  OrderCardService orderCardService;

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

    handleUpdatesOnCustomerByCardId(request, recharge);
    recharge.updateRecharge(request);

    return recharge;
  }

  public void deleteRecharge(RequestUpdateRecharge request) {
    var recharge = takeRechargeByUuid(request.uuid());

    handleUpdatesOnCustomerByCardId(
        new RequestUpdateRecharge(
            request.uuid(),
            "0",
            null),
        recharge);

    recharge.deleteRecharge();
  }

  private Customer handleChangesOnCustomerByCardId(RequestRecharge request) {
    Customer customer;
    try {
      customer = customerService.takeActiveCustomerByCardId(request.orderCardId());
      orderCardService.updateDebitOrderCard(request.orderCardId(), request.rechargeValue());
    } catch (Exception e) {  // TODO: handle error of customer non-existence (change the Exception generic)
      customer = customerService.initializeCustomer(
          new RequestCustomer(
              new RequestUpdateOrderCard(
                  request.orderCardId(),
                  request.rechargeValue(),
                  true)
          )
      );
    }
    return customer;
  }

  private void handleUpdatesOnCustomerByCardId(RequestUpdateRecharge request, Recharge recharge) {
    if (request.rechargeValue() != null) {
      var newRechargeValue = new BigDecimal(request.rechargeValue());
      var currentRechargeVale = recharge.getRechargeValue();
      var currentDebit = recharge.getCustomer().getOrderCard().getDebit();

      var difference = newRechargeValue.subtract(currentRechargeVale);

      if (difference.add(currentDebit).compareTo(BigDecimal.ZERO) >= 0 ) {
        orderCardService.updateDebitOrderCard(recharge.getCustomer().getOrderCard().getId(), difference.toString());
      }
      // TODO: error: new RechargeValue can't result in a debit negative in OrderCard
    }
  }
}

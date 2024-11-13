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
import java.util.Optional;
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
    var voluntary = voluntaryService.takeVoluntary(request.voluntaryId());
    var customer = verifyChangesOnCustomerByCardId(request);

    var recharge = new Recharge(request, customer, voluntary);
    repository.save(recharge);

    return recharge;
  }

  public Recharge takeRecharge(String uuid) {
    var rechargeOptional = repository.findByIdValidTrue(UUID.fromString(uuid));

    if (rechargeOptional.isPresent()) {
      return rechargeOptional.get();
    } else {
      // TODO: error: input error field id
      return new Recharge();
    }
  }

  public List<Recharge> listRecharges() {
    return repository.findAllByValidTrue();
  }

  @Transactional
  public Recharge updateRecharge(RequestUpdateRecharge request) {
    var rechargeOptional = repository.findById(UUID.fromString(request.uuid()));

    if (rechargeOptional.isPresent()) {
      var recharge = rechargeOptional.get();
      recharge.updateRecharge(request);

      verifyUpdatesOnCustomerByCardId(request, recharge);

      return recharge;
    } else {
      // TODO: error: input error field id
      return new Recharge();
    }
  }

  public void deleteRecharge(RequestUpdateRecharge request) {
    Optional<Recharge> rechargeOptional = repository.findByIdValidTrue(UUID.fromString(request.uuid()));

    if (rechargeOptional.isPresent()) {
      var recharge = rechargeOptional.get();

      verifyUpdatesOnCustomerByCardId(request, recharge);
      recharge.deleteRecharge();
    } // else
    // TODO : error. id incorrect or already deleted
  }

  private Customer verifyChangesOnCustomerByCardId(RequestRecharge request) {
    var customer = customerService.takeActiveCustomerByCardId(request.orderCardId());

    if (customer == null) {  // TODO: use of option to fix, error: card_id invalid or card_id without a customer active
      customer = customerService.initializeCustomer(
          new RequestCustomer(
              new RequestUpdateOrderCard(
                  request.orderCardId(),
                  request.rechargeValue(),
                  true)
          )
      );
    } else {
      orderCardService.updateDebitOrderCard(request.orderCardId(), request.rechargeValue());
    }

    return customer;
  }

  private void verifyUpdatesOnCustomerByCardId(RequestUpdateRecharge request, Recharge recharge) {
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

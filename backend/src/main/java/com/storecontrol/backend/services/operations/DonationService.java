package com.storecontrol.backend.services.operations;

import com.storecontrol.backend.models.customers.request.RequestAuxFinalizeCustomer;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.operations.Donation;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.repositories.operations.DonationRepository;
import com.storecontrol.backend.services.customers.validation.FinalizationOfCustomerValidate;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class DonationService {

  @Autowired
  DonationRepository repository;

  @Autowired
  FinalizationOfCustomerValidate validate;

  @Transactional
  public void createDonation(RequestAuxFinalizeCustomer request,
                             Customer customer,
                             Voluntary voluntary) {
    var donationValue = request.donationValue();

    validate.checkDonationValueValid(donationValue, customer);

    customer.getOrderCard().incrementDebit(donationValue.negate());
    var donation = new Donation(request, customer, voluntary);
    customer.setDonations(List.of(donation));

    repository.save(donation);
  }

  public Donation takeDonationByUuid(String uuid) {
    var donationOptional = repository.findByUuidValidTrue(UUID.fromString(uuid));

    return donationOptional.orElseGet(Donation::new);  // TODO: ERROR: donation_uuid invalid
  }

  public List<Donation> listDonations() {
    return repository.findAllValidTrue();
  }

  @Transactional
  public void deleteDonation(Customer customer) {
    customer.getOrderCard().incrementDebit(customer.getDonations().getFirst().getDonationValue());

    customer.getDonations().getFirst().deleteDonation();
  }
}

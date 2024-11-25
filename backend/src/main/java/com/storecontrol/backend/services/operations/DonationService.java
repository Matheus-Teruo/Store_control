package com.storecontrol.backend.services.operations;

import com.storecontrol.backend.models.customers.request.RequestCustomerFinalization;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.operations.Donation;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.repositories.operations.DonationRepository;
import com.storecontrol.backend.services.customers.component.CustomerFinalizationValidation;
import com.storecontrol.backend.services.operations.validation.DonationValidation;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DonationService {

  @Autowired
  DonationValidation validation;

  @Autowired
  DonationRepository repository;

  @Autowired
  CustomerFinalizationValidation finalizationValidation;

  @Transactional
  public void createDonation(RequestCustomerFinalization request,
                             Customer customer,
                             Voluntary voluntary) {
    var donationValue = request.donationValue();

    validation.checkVoluntaryFunctionMatch(voluntary);
    finalizationValidation.checkDonationValueValid(donationValue, customer);

    customer.getOrderCard().incrementDebit(donationValue.negate());
    var donation = new Donation(request, customer, voluntary);
    customer.setDonations(List.of(donation));

    repository.save(donation);
  }

  public Donation takeDonationByUuid(UUID uuid) {
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(EntityNotFoundException::new);
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

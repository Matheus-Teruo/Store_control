package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.donation.RequestDonation;
import com.storecontrol.backend.controllers.request.donation.RequestDeleteDonation;
import com.storecontrol.backend.models.Donation;
import com.storecontrol.backend.repositories.DonationRepository;
import com.storecontrol.backend.services.validation.DonationValidate;
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
  DonationValidate validate;

  @Autowired
  VoluntaryService voluntaryService;

  @Autowired
  CustomerService customerService;

  @Transactional
  public Donation createDonation(RequestDonation request) {
    var voluntary = voluntaryService.takeVoluntaryByUuid(request.voluntaryId());
    var customer = customerService.takeActiveCustomerByCardId(request.orderCardId());

    validate.checkInsufficientDebitToDonate(request, customer);

    customer.getOrderCard().incrementDebit(new BigDecimal(request.donationValue()).negate());
    var donation = new Donation(request, customer, voluntary);

    repository.save(donation);

    // TODO: verify if remind debit on order card
    customerService.finalizeCustomer(request.orderCardId());
    return donation;
  }

  public Donation takeDonationByUuid(String uuid) {
    var donationOptional = repository.findByUuidValidTrue(UUID.fromString(uuid));

    return donationOptional.orElseGet(Donation::new);  // TODO: ERROR: donation_uuid invalid
  }

  public List<Donation> listDonations() {
    return repository.findAllValidTrue();
  }

  @Transactional
  public void deleteDonation(RequestDeleteDonation request) {
    var donation = takeDonationByUuid(request.uuid());

    donation.getCustomer().undoFinalizeCustomer();
    donation.getCustomer().getOrderCard().incrementDebit(donation.getDonationValue());

    donation.deleteDonation();
  }
}

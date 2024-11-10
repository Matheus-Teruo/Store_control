package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.voluntary.RequestUpdateVoluntary;
import com.storecontrol.backend.controllers.response.voluntary.ResponseVoluntary;
import com.storecontrol.backend.models.Association;
import com.storecontrol.backend.models.Stand;
import com.storecontrol.backend.models.Voluntary;
import com.storecontrol.backend.repositories.AssociationRepository;
import com.storecontrol.backend.repositories.StandRepository;
import com.storecontrol.backend.repositories.VoluntaryRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class VoluntaryService {

  @Autowired
  VoluntaryRepository repository;

  @Autowired
  AssociationRepository associationRepository;

  @Autowired
  StandRepository standRepository;

  @Transactional
  public ResponseVoluntary serviceUptadeVoluntary(RequestUpdateVoluntary request) {
    Optional<Voluntary> voluntary = repository.findById(UUID.fromString(request.uuid()));

    Optional<Association> association = associationRepository.findById(UUID.fromString(request.associationId()));
    Optional<Stand> stand = standRepository.findById(UUID.fromString(request.standId()));

    if (voluntary.isPresent()) {
      var selectedVoluntary = voluntary.get();
      var selectedAssociation = new Association();
      var selectedStand = new Stand();

      if (association.isPresent()) {
        selectedAssociation = association.get();
      }
      if (stand.isPresent()) {
        selectedStand = stand.get();
      }
      selectedVoluntary.updateVoluntary(request, selectedAssociation, selectedStand);
      return new ResponseVoluntary(selectedVoluntary);
    } else {
      return new ResponseVoluntary(new Voluntary());
    }
  }

  public void serviceDeleteVoluntary(RequestUpdateVoluntary request) {
    Optional<Voluntary> voluntary = repository.findById(UUID.fromString(request.uuid()));

    voluntary.ifPresent(Voluntary::deleteVoluntary);
  }
}

package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.voluntary.RequestCreateVoluntary;
import com.storecontrol.backend.controllers.request.voluntary.RequestUpdateVoluntary;
import com.storecontrol.backend.models.Voluntary;
import com.storecontrol.backend.repositories.VoluntaryRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class VoluntaryService {

  @Autowired
  VoluntaryRepository repository;

  @Autowired
  StandService standService;

  @Transactional
  public Voluntary createVoluntary(RequestCreateVoluntary request) {
    var voluntary = new Voluntary(request);
    repository.save(voluntary);

    return voluntary;
  }

  public Voluntary takeVoluntary(String uuid){
    return repository.findByIdValidTrue(UUID.fromString(uuid));
  }

  public List<Voluntary> listVolunteers() {
    return repository.findAllByValidTrue();
  }

  @Transactional
  public Voluntary uptadeVoluntary(RequestUpdateVoluntary request) {
    Optional<Voluntary> voluntaryOptional = repository.findById(UUID.fromString(request.uuid()));

    if (voluntaryOptional.isPresent()) {
      var voluntary = voluntaryOptional.get();
      voluntary.updateVoluntary(request);

      if (request.standId() != null) {
        var stand = standService.takeStand(request.standId());
        voluntary.updateVoluntary(stand);
      }

      return voluntary;
    } else {
      return new Voluntary();
    }
  }

  @Transactional
  public void deleteVoluntary(RequestUpdateVoluntary request) {
    Optional<Voluntary> voluntary = repository.findById(UUID.fromString(request.uuid()));

    voluntary.ifPresent(Voluntary::deleteVoluntary);
  }
}

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

  public Voluntary takeVoluntaryByUuid(String uuid){
    var voluntaryOptional = repository.findByUuidValidTrue(UUID.fromString(uuid));

    return voluntaryOptional.orElseGet(Voluntary::new);  // TODO: ERROR: voluntary_uuid invalid
  }

  public List<Voluntary> listVolunteers() {
    return repository.findAllValidTrue();
  }

  @Transactional
  public Voluntary uptadeVoluntary(RequestUpdateVoluntary request) {
    var voluntary = takeVoluntaryByUuid(request.uuid());

    voluntary.updateVoluntary(request);
    verifyUpdateStand(request.standId(), voluntary);

    return voluntary;
  }

  @Transactional
  public void deleteVoluntary(RequestUpdateVoluntary request) {
    Optional<Voluntary> voluntary = repository.findById(UUID.fromString(request.uuid()));

    voluntary.ifPresent(Voluntary::deleteVoluntary);
  }

  private void verifyUpdateStand(String uuid, Voluntary voluntary) {
    if (uuid != null) {
      var stand = standService.takeStandByUuid(uuid);

      voluntary.updateVoluntary(stand);
    }
  }
}

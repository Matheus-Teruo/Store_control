package com.storecontrol.backend.services.volunteers;

import com.storecontrol.backend.models.volunteers.request.RequestCreateVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestUpdateVoluntary;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.repositories.volunteers.VoluntaryRepository;
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
  FunctionService functionService;

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
    verifyUpdateFunction(request.standId(), voluntary);

    return voluntary;
  }

  @Transactional
  public void deleteVoluntary(RequestUpdateVoluntary request) {
    Optional<Voluntary> voluntary = repository.findById(UUID.fromString(request.uuid()));

    voluntary.ifPresent(Voluntary::deleteVoluntary);
  }

  private void verifyUpdateFunction(String uuid, Voluntary voluntary) {
    if (uuid != null) {
      var function = functionService.takeFunctionByUuid(uuid);

      voluntary.updateVoluntary(function);
    }
  }
}

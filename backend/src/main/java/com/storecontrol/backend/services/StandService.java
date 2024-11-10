package com.storecontrol.backend.services;

import com.storecontrol.backend.controllers.request.stand.RequestUpdateStand;
import com.storecontrol.backend.controllers.response.stand.ResponseStand;
import com.storecontrol.backend.models.Stand;
import com.storecontrol.backend.repositories.StandRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class StandService {

  @Autowired
  StandRepository repository;

  @Transactional
  public ResponseStand serviceUptadeStand(RequestUpdateStand request) {
    Optional<Stand> stand = repository.findById(UUID.fromString(request.uuid()));

    if (stand.isPresent()) {
      stand.get().updateStand(request);
      return new ResponseStand(stand.get());
    } else {
      return new ResponseStand(new Stand());
    }
  }

  public void serviceDeleteStand(RequestUpdateStand request) {
    Optional<Stand> stand = repository.findById(UUID.fromString(request.uuid()));

    stand.ifPresent(Stand::deleteStand);
  }
}

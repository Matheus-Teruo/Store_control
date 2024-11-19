package com.storecontrol.backend.services.volunteers;

import com.storecontrol.backend.models.volunteers.Function;
import com.storecontrol.backend.repositories.volunteers.FunctionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class FunctionService {

  @Autowired
  FunctionRepository repository;

  public Function takeFunctionByUuid(String uuid) {
    return repository.findByUuidValidTrue(UUID.fromString(uuid))
        .orElseThrow(() -> new RuntimeException("Function not found"));  // TODO: ERROR: function_uuid invalid
  }
}

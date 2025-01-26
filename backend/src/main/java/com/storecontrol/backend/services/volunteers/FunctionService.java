package com.storecontrol.backend.services.volunteers;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.volunteers.Function;
import com.storecontrol.backend.repositories.volunteers.FunctionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class FunctionService {

  @Autowired
  FunctionRepository repository;

  public Function takeFunctionByUuid(UUID uuid) {
    return repository.findByUuidValidTrue(uuid)
        .orElseThrow(() -> new InvalidDatabaseQueryException(
            MessageResolver.getInstance().getMessage("service.exception.function.get.validation.error"),
            MessageResolver.getInstance().getMessage("service.exception.function.get.validation.message"),
            uuid.toString())
        );
  }

  public List<Function> listFunctions() {
    return repository.findAllValidTrue();
  }
}

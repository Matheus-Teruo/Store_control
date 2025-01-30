package com.storecontrol.backend.services.volunteers.validation;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseInsertionException;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.volunteers.request.RequestUpdateVoluntaryFunction;
import com.storecontrol.backend.repositories.volunteers.VoluntaryRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Component
public class VoluntaryValidation {

  @Autowired
  VoluntaryRepository repository;

  public void checkVoluntaryAuthentication(UUID requestUuid, UUID loggedUuid){
    if (!requestUuid.equals(loggedUuid)) {
      var user = repository.findByUuidValidTrue(loggedUuid).orElseThrow(EntityNotFoundException::new);
      if (user.getVoluntaryRole().isNotAdmin()) {
        throw new InvalidDatabaseQueryException(
            MessageResolver.getInstance().getMessage("validation.voluntary.checkAuthentication.voluntaryMatch.error"),
            MessageResolver.getInstance().getMessage("validation.voluntary.checkAuthentication.voluntaryMatch.message"),
            requestUuid.toString()
        );
      }
    }
  }

  public void checkNameDuplication(String username, String fullname) {
    if (username != null && repository.existsByUserUsername(username)) {
      throw new InvalidDatabaseInsertionException(
          MessageResolver.getInstance().getMessage("validation.voluntary.checkUsername.nameDuplication.error"),
          MessageResolver.getInstance().getMessage("validation.voluntary.checkUsername.nameDuplication.message"),
          Map.of(
              MessageResolver.getInstance().getMessage("validation.voluntary.checkUsername.nameDuplication.field"),
              username
          )
      );
    }
    if (fullname != null && repository.existsByFullname(fullname)) {
      throw new InvalidDatabaseInsertionException(
          MessageResolver.getInstance().getMessage("validation.voluntary.checkFullname.nameDuplication.error"),
          MessageResolver.getInstance().getMessage("validation.voluntary.checkFullname.nameDuplication.message"),
          Map.of(
              MessageResolver.getInstance().getMessage("validation.voluntary.checkFullname.nameDuplication.field"),
              fullname
          )
      );
    }
  }

  public void checkManagerSetOwnsFunction(RequestUpdateVoluntaryFunction request, UUID functionUuid) {
    if (request.functionUuid() != functionUuid) {
      throw new InvalidDatabaseInsertionException(
          MessageResolver.getInstance().getMessage("validation.voluntary.checkManagementFunction.invalid.error"),
          MessageResolver.getInstance().getMessage("validation.voluntary.checkManagementFunction.invalid.message"),
          Map.of(
              MessageResolver.getInstance().getMessage("validation.voluntary.checkManagementFunction.invalid.field"),
              request.functionUuid().toString()
          )
      );
    }
  }
}

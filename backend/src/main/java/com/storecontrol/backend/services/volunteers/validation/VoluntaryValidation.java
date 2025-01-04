package com.storecontrol.backend.services.volunteers.validation;

import com.storecontrol.backend.infra.exceptions.InvalidDatabaseInsertionException;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.repositories.volunteers.VoluntaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Component
public class VoluntaryValidation {

  @Autowired
  VoluntaryRepository repository;

  public void checkVolyntaryAuthentication(UUID requestUuid, UUID loggedUuid){
    if (!requestUuid.equals(loggedUuid)) {
      throw new InvalidDatabaseQueryException(
          "User not allow",
          "VoluntaryRequest",
          requestUuid.toString()
      );
    }
  }

  public void checkNameDuplication(String username, String fullname) {
    if (username != null && repository.existsByUserUsername(username)) {
      throw new InvalidDatabaseInsertionException(
          "name already used",
          "Voluntary",
          Map.of("username", username)
      );
    }
    if (fullname != null && repository.existsByFullname(fullname)) {
      throw new InvalidDatabaseInsertionException(
          "name already used",
          "Voluntary",
          Map.of("fullname", fullname)
      );
    }
  }
}

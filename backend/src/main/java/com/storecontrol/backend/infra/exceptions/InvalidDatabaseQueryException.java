package com.storecontrol.backend.infra.exceptions;

import com.storecontrol.backend.config.language.MessageResolver;
import lombok.Getter;

@Getter
public class InvalidDatabaseQueryException extends RuntimeException {

  private final String typeOfError;
  private final String entityName;
  private final String invalidValue;

  public InvalidDatabaseQueryException(String typeOfError, String entityName, String invalidValue) {
    super(MessageResolver.getInstance().getMessage(
        "exception.database.query.message",
        entityName,
        invalidValue)
    );
    this.typeOfError = typeOfError;
    this.entityName = entityName;
    this.invalidValue = invalidValue;
  }

}

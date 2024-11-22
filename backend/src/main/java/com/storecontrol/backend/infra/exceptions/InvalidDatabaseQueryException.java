package com.storecontrol.backend.infra.exceptions;

import lombok.Getter;

@Getter
public class InvalidDatabaseQueryException extends RuntimeException {

  private final String typeOfError;
  private final String entityName;
  private final String invalidValue;

  public InvalidDatabaseQueryException(String typeOfError, String entityName, String invalidValue) {
    super("Invalid value for entity '" + entityName + "': " + invalidValue);
    this.typeOfError = typeOfError;
    this.entityName = entityName;
    this.invalidValue = invalidValue;
  }

}

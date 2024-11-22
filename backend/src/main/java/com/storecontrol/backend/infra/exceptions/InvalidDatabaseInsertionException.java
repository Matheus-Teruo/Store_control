package com.storecontrol.backend.infra.exceptions;

import lombok.Getter;

import java.util.Map;

@Getter
public class InvalidDatabaseInsertionException extends RuntimeException {

  private final String descriptionOfError;
  private final String entityName;
  private final Map<String, String> fieldErrors;

  public InvalidDatabaseInsertionException(String descriptionOfError, String entityName, Map<String,String> fieldErrors) {
    super("Invalid value to create entity:'" + entityName);
    this.descriptionOfError = descriptionOfError;
    this.entityName = entityName;
    this.fieldErrors = fieldErrors;
  }
}

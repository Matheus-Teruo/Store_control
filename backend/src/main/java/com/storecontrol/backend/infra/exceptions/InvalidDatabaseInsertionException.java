package com.storecontrol.backend.infra.exceptions;

import lombok.Getter;

import java.util.Map;
import java.util.stream.Collectors;

@Getter
public class InvalidDatabaseInsertionException extends RuntimeException {

  private final String error;
  private final String entityName;
  private final Map<String, String> fieldErrors;

  public InvalidDatabaseInsertionException(String error, String entityName, Map<String,String> fieldErrors) {
    super("Fait to create entity: " + entityName + ". \n" +
        "Field(s) error: " + fieldErrors.entrySet().stream()
        .map(entry -> entry.getKey() + ": " + entry.getValue())
        .collect(Collectors.joining(", ")));
    this.error = error;
    this.entityName = entityName;
    this.fieldErrors = fieldErrors;
  }
}

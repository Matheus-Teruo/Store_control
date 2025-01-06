package com.storecontrol.backend.infra.exceptions;

import com.storecontrol.backend.config.language.MessageResolver;
import lombok.Getter;

import java.util.Map;
import java.util.stream.Collectors;

@Getter
public class InvalidDatabaseInsertionException extends RuntimeException {

  private final String error;
  private final String entityName;
  private final Map<String, String> fieldErrors;

  public InvalidDatabaseInsertionException(String error, String entityName, Map<String,String> fieldErrors) {
    super(MessageResolver.getInstance().getMessage(
        "exception.database.insertion.message",
        entityName,
        fieldErrors.entrySet().stream()
        .map(entry -> entry.getKey() + ": " + entry.getValue())
        .collect(Collectors.joining(", ")))
    );
    this.error = error;
    this.entityName = entityName;
    this.fieldErrors = fieldErrors;
  }
}

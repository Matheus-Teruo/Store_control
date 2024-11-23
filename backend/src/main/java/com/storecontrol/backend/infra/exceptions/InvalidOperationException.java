package com.storecontrol.backend.infra.exceptions;

import lombok.Getter;

@Getter
public class InvalidOperationException extends RuntimeException {

  private final String typeOfError;
  private final String error;

  public InvalidOperationException(String typeOfError, String error) {
    super("Invalid operation on '" + typeOfError);
    this.typeOfError = typeOfError;
    this.error = error;
  }
}

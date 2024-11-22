package com.storecontrol.backend.infra.exceptions;

import lombok.Getter;

@Getter
public class InvalidCustomerException extends RuntimeException {

  private final String typeOfError;
  private final String error;

  public InvalidCustomerException(String typeOfError, String error) {
    super("Invalid manipulation on Customer on '" + typeOfError);
    this.typeOfError = typeOfError;
    this.error = error;
  }
}

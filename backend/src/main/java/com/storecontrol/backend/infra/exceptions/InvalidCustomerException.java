package com.storecontrol.backend.infra.exceptions;

import com.storecontrol.backend.config.language.MessageResolver;
import lombok.Getter;

@Getter
public class InvalidCustomerException extends RuntimeException {

  private final String typeOfError;
  private final String error;

  public InvalidCustomerException(String typeOfError, String error) {
    super(MessageResolver.getInstance().getMessage(
        "exception.customer.message",
        typeOfError)
    );
    this.typeOfError = typeOfError;
    this.error = error;
  }
}

package com.storecontrol.backend.infra.exceptions;

import com.storecontrol.backend.config.language.MessageResolver;
import lombok.Getter;

@Getter
public class InvalidOperationException extends RuntimeException {

  private final String typeOfError;
  private final String error;

  public InvalidOperationException(String typeOfError, String error) {
    super(MessageResolver.getInstance().getMessage(
        "exception.operation.message",
        typeOfError)
    );
    this.typeOfError = typeOfError;
    this.error = error;
  }
}

package com.storecontrol.backend.infra;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidCustomerException;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseInsertionException;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.infra.exceptions.InvalidOperationException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(EntityNotFoundException.class)
  public ResponseEntity<Void> handleError404(EntityNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();

    for (FieldError error : ex.getBindingResult().getFieldErrors()) {
      errors.put(error.getField(), error.getDefaultMessage());
    }

    Map<String, Object> response = new HashMap<>();
    response.put("status", HttpStatus.BAD_REQUEST.value());
    response.put("errorType",
        MessageResolver.getInstance().getMessage(
        "exception.global.methodNotValid.errorType")
    );
    response.put("invalidFields", errors);
    response.put("error", MessageResolver.getInstance().getMessage("exception.global.methodNotValid.error"));
    response.put("message", MessageResolver.getInstance().getMessage("exception.global.methodNotValid.message"));


    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
  }

  @ExceptionHandler(InvalidCustomerException.class)
  public ResponseEntity<Map<String, String>> handleCustomerExceptions(InvalidCustomerException ex) {
    Map<String, String> error = new HashMap<>();
    error.put("errorType",
        MessageResolver.getInstance().getMessage(
        "exception.global.customerException.errorType")
    );
    error.put("typeOfError", ex.getTypeOfError());
    error.put("error", ex.getError());
    error.put("message", ex.getMessage());

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }

  @ExceptionHandler(InvalidOperationException.class)
  public ResponseEntity<Map<String, String>> handleOperationExceptions(InvalidOperationException ex) {
    Map<String, String> error = new HashMap<>();
    error.put("errorType",
        MessageResolver.getInstance().getMessage(
            "exception.global.operationException.errorType")
    );
    error.put("typeOfError", ex.getTypeOfError());
    error.put("error", ex.getError());
    error.put("message", ex.getMessage());

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }

  @ExceptionHandler(InvalidDatabaseInsertionException.class)
  public ResponseEntity<Map<String, Object>> handleDatabaseInsertionExceptions(InvalidDatabaseInsertionException ex) {
    Map<String, Object> error = new HashMap<>();
    error.put("errorType",
        MessageResolver.getInstance().getMessage(
            "exception.global.insertEntity.errorType")
    );
    error.put("entity", ex.getEntityName());
    error.put("invalidFields", ex.getFieldErrors());
    error.put("error", ex.getError());
    error.put("message", ex.getMessage());

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }

  @ExceptionHandler(InvalidDatabaseQueryException.class)
  public ResponseEntity<Map<String, String>> handleDatabaseQueryExceptions(InvalidDatabaseQueryException ex) {
    Map<String, String> error = new HashMap<>();
    error.put("errorType",
        MessageResolver.getInstance().getMessage(
            "exception.global.queryEntity.errorType")
    );
    error.put("entity", ex.getEntityName());
    error.put("invalidValue", ex.getInvalidValue());
    error.put("error", ex.getMessage());
    error.put("message", ex.getMessage());

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }
}
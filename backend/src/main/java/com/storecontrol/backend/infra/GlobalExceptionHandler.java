package com.storecontrol.backend.infra;

import com.storecontrol.backend.infra.exceptions.InvalidDatabaseInsertionException;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
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
    response.put("errorType", "Validation Error");
    response.put("message", "Request contains invalid fields");
    response.put("details", errors);

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
  }

  @ExceptionHandler(InvalidDatabaseInsertionException.class)
  public ResponseEntity<Map<String, Object>> handleDatabaseInsertionExceptions(InvalidDatabaseInsertionException ex) {
    Map<String, Object> error = new HashMap<>();
    error.put("errorType", "Insertion Entity Error");
    error.put("entity", ex.getEntityName());
    error.put("invalidFields", ex.getFieldErrors());
    error.put("description", ex.getDescriptionOfError());
    error.put("error", ex.getMessage());

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }

  @ExceptionHandler(InvalidDatabaseQueryException.class)
  public ResponseEntity<Map<String, String>> handleDatabaseQueryExceptions(InvalidDatabaseQueryException ex) {
    Map<String, String> error = new HashMap<>();
    error.put("errorType", "Query Entity Error");
    error.put("entity", ex.getEntityName());
    error.put("invalidValue", ex.getInvalidValue());
    error.put("error", ex.getMessage());

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }
}
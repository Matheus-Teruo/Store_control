
package com.storecontrol.backend.infra.exceptions;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.dto.ApiError;
import com.storecontrol.backend.infra.exceptions.dto.FieldErrorDetail;

import jakarta.persistence.EntityNotFoundException;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

import javax.security.sasl.AuthenticationException;

@Slf4j 
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiError> handleError404(
            EntityNotFoundException ex,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.NOT_FOUND;

        ApiError error = ApiError.of(
                status,
                status.getReasonPhrase(),
                ex.getMessage(),
                request.getRequestURI()
        );

        log.debug(
            "Entity not found | path={} | cause={}",
            request.getRequestURI(),
            ex.getMessage()
        );

        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationExceptions(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        List<FieldErrorDetail> fields = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> new FieldErrorDetail(
                    err.getField(),
                    err.getDefaultMessage()
                ))
                .toList();

        ApiError error = ApiError.validation(
                status,
                MessageResolver.getInstance().getMessage(
                        "exception.global.methodNotValid.errorType"
                ),
                MessageResolver.getInstance().getMessage(
                        "exception.global.methodNotValid.message"
                ),
                request.getRequestURI(),
                fields
        );

        log.warn(
            "Validation Error | fields={} | path={} | cause={}",
            fields,
            request.getRequestURI(),
            ex.getMessage()
        );

        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(InvalidCustomerException.class)
    public ResponseEntity<ApiError> handleCustomerExceptions(
            InvalidCustomerException ex,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        ApiError error = ApiError.of(
                status,
                MessageResolver.getInstance().getMessage(
                        "exception.global.customerException.errorType"
                ),
                ex.getMessage(),
                request.getRequestURI()
        );

        log.debug(
            "Invalidate Customer | path={} | cause={}",
            request.getRequestURI(),
            ex.getMessage()
        );

        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(InvalidOperationException.class)
    public ResponseEntity<ApiError> handleOperationExceptions(
            InvalidOperationException ex,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        ApiError error = ApiError.of(
                status,
                MessageResolver.getInstance().getMessage(
                        "exception.global.operationException.errorType"
                ),
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(InvalidDatabaseInsertionException.class)
    public ResponseEntity<ApiError> handleDatabaseInsertionExceptions(
            InvalidDatabaseInsertionException ex,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        List<FieldErrorDetail> fields = ex.getFieldErrors()
                .entrySet()
                .stream()
                .map(entry -> new FieldErrorDetail(
                        entry.getKey(),
                        entry.getValue()
                ))
                .toList();

        ApiError error = ApiError.validation(
                status,
                MessageResolver.getInstance().getMessage(
                        "exception.global.insertEntity.errorType"
                ),
                ex.getMessage(),
                request.getRequestURI(),
                fields
        );

        log.debug(
            "Invalid Database Insertion | path={} | cause={}",
            request.getRequestURI(),
            ex.getMessage()
        );

        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(InvalidDatabaseQueryException.class)
    public ResponseEntity<ApiError> handleDatabaseQueryExceptions(
            InvalidDatabaseQueryException ex,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        ApiError error = ApiError.of(
                status,
                MessageResolver.getInstance().getMessage(
                        "exception.global.queryEntity.errorType"
                ),
                ex.getMessage(),
                request.getRequestURI()
        );

        log.debug(
            "Invalid Database Query | path={} | cause={}",
            request.getRequestURI(),
            ex.getMessage()
        );

        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiError> handleAuthenticationException(
        AuthenticationException ex,
        HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;

        ApiError error = ApiError.of(
                status,
                "Authentication fail",
                ex.getMessage(),
                request.getRequestURI()
        );

        log.debug(
            "Authentication failed | path={} | cause={}",
            request.getRequestURI(),
            ex.getMessage()
        );

        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(
            Exception ex,
            HttpServletRequest request
    ) {
        log.error(
            "System error | type={} | errorMessage={} | path={}",
            ex.getClass().getName(),
            ex.getMessage(),
            request.getRequestURI()
        );

        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiError.of(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Erro interno do sistema",
                "Erro interno inesperado: " + ex.getMessage(),
                request.getRequestURI()
            ));
    }
}

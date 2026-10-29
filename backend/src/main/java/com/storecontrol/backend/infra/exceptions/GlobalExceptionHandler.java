
package com.storecontrol.backend.infra.exceptions;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.dto.ApiError;
import com.storecontrol.backend.infra.exceptions.dto.FieldErrorDetail;

import jakarta.persistence.EntityNotFoundException;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@Slf4j 
@RestControllerAdvice
public class GlobalExceptionHandler {

    private final MessageResolver messageResolver =
            MessageResolver.getInstance();

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
                .map(this::toFieldErrorDetail)
                .toList();

        ApiError error = ApiError.validation(
                status,
                messageResolver.getMessage(
                        "exception.global.methodNotValid.errorType"
                ),
                messageResolver.getMessage(
                        "exception.global.methodNotValid.message"
                ),
                request.getRequestURI(),
                fields
        );

        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(InvalidCustomerException.class)
    public ResponseEntity<ApiError> handleCustomerExceptions(
            InvalidCustomerException ex,
            HttpServletRequest request
    ) {
        return badRequest(
                messageResolver.getMessage(
                        "exception.global.customerException.errorType"
                ),
                ex.getMessage(),
                request
        );
    }

    @ExceptionHandler(InvalidOperationException.class)
    public ResponseEntity<ApiError> handleOperationExceptions(
            InvalidOperationException ex,
            HttpServletRequest request
    ) {
        return badRequest(
                messageResolver.getMessage(
                        "exception.global.operationException.errorType"
                ),
                ex.getMessage(),
                request
        );
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
                messageResolver.getMessage(
                        "exception.global.insertEntity.errorType"
                ),
                ex.getMessage(),
                request.getRequestURI(),
                fields
        );

        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(InvalidDatabaseQueryException.class)
    public ResponseEntity<ApiError> handleDatabaseQueryExceptions(
            InvalidDatabaseQueryException ex,
            HttpServletRequest request
    ) {
        return badRequest(
                messageResolver.getMessage(
                        "exception.global.queryEntity.errorType"
                ),
                ex.getMessage(),
                request
        );
    }

    private ResponseEntity<ApiError> badRequest(
            String title,
            String message,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        ApiError error = ApiError.of(
                status,
                title,
                message,
                request.getRequestURI()
        );

        return ResponseEntity.status(status).body(error);
    }

    private FieldErrorDetail toFieldErrorDetail(FieldError error) {
        return new FieldErrorDetail(
                error.getField(),
                error.getDefaultMessage()
        );
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

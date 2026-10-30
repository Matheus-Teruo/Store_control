package com.storecontrol.backend.config.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.storecontrol.backend.infra.exceptions.dto.ApiError;

import java.io.IOException;

@Component
@RequiredArgsConstructor 
public class CustomAccessDeniedHandler implements AccessDeniedHandler {
    
    private final ObjectMapper mapper;

    @Override
    public void handle(
        HttpServletRequest request,
        HttpServletResponse response,
        AccessDeniedException ex
    ) throws IOException {

        ApiError error = ApiError.of(
            HttpStatus.FORBIDDEN,
            "Proibido",
            "Você não tem permissão para acessar esse recurso.",
            request.getRequestURI()
        );

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        mapper.writeValue(response.getOutputStream(), error);
    }
}
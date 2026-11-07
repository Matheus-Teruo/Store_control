package com.storecontrol.backend.controllers.integration;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.storecontrol.backend.models.integration.SyncFeatureToggle;
import com.storecontrol.backend.models.integration.response.ExternalOrderDTO;
import com.storecontrol.backend.services.integration.OrderManagerService;
import com.storecontrol.backend.services.integration.SyncFeatureToggleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("pag-bank")
@RequiredArgsConstructor 
public class PagBankHookController {

    private final SyncFeatureToggleService service;
    private final OrderManagerService orderManagerService;

    @PostMapping("/order-hook")
    public ResponseEntity<Void> createOrderWithHook(@RequestBody @Valid ExternalOrderDTO request) {
        SyncFeatureToggle syncFeatureToggle = service.getActiveSyncFeatureToggle();
        orderManagerService.createOrderWithHook(request, syncFeatureToggle);

        return ResponseEntity.noContent().build();
    }
}

package com.storecontrol.backend.controllers.integration;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.storecontrol.backend.models.integration.SyncFeatureToggle;
import com.storecontrol.backend.models.integration.request.CreateSyncFeatureToggleRequest;
import com.storecontrol.backend.models.integration.request.SyncOrderRequest;
import com.storecontrol.backend.models.integration.response.SyncFeatureToggleResponse;
import com.storecontrol.backend.models.integration.response.SyncFeatureToggleResumeResponse;
import com.storecontrol.backend.services.integration.OrderManagerService;
import com.storecontrol.backend.services.integration.SyncFeatureToggleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping ("sync-feature")
@RequiredArgsConstructor
public class SyncFeatureController {

    private final SyncFeatureToggleService service;
    private final OrderManagerService orderManagerService;

    @PostMapping("/toggle")
    public ResponseEntity<SyncFeatureToggleResponse> createToggle(@RequestBody @Valid CreateSyncFeatureToggleRequest request) {
        SyncFeatureToggle syncFeatureToggle = service.createSyncFeatureToggle(request);

        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{uuid}")
            .buildAndExpand(syncFeatureToggle.getId())
            .toUri();

        return ResponseEntity.created(location).body(new SyncFeatureToggleResponse(syncFeatureToggle));
    }

    @GetMapping("/toggle/{togglerUuid}")
    public ResponseEntity<SyncFeatureToggleResponse> getToggle(@PathVariable @Valid UUID togglerUuid) {
        SyncFeatureToggle syncFeatureToggle = service.getSyncFeatureToggle(togglerUuid);

        return ResponseEntity.ok(new SyncFeatureToggleResponse(syncFeatureToggle));
    }

    @GetMapping("/toggle")
    public ResponseEntity<List<SyncFeatureToggleResumeResponse>> listToggle() {
        List<SyncFeatureToggle> syncFeatureToggle = service.listSyncFeatureToggle();

        var response = syncFeatureToggle.stream().map(SyncFeatureToggleResumeResponse::new).toList();
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/order")
    public ResponseEntity<Void> createOrder(@RequestBody @Valid SyncOrderRequest request) {
        SyncFeatureToggle syncFeatureToggle = service.getSyncFeatureToggle(request.syncFeatureToggleUuid());
        orderManagerService.createBatchOrder(request.orderCodes(), syncFeatureToggle);

        return ResponseEntity.noContent().build();
    }
}

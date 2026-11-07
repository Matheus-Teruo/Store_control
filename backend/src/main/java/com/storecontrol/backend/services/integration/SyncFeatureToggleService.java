package com.storecontrol.backend.services.integration;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.storecontrol.backend.models.integration.SyncFeatureToggle;
import com.storecontrol.backend.models.integration.request.CreateSyncFeatureToggleRequest;
import com.storecontrol.backend.repositories.integration.SyncFeatureToggleRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service 
@RequiredArgsConstructor 
public class SyncFeatureToggleService {

    private final SyncFeatureToggleRepository repository;
    
    public SyncFeatureToggle createSyncFeatureToggle(CreateSyncFeatureToggleRequest request) {
        var syncFeatureToggle = new SyncFeatureToggle(request);

        repository.save(syncFeatureToggle);

        return syncFeatureToggle;
    }

    public SyncFeatureToggle getSyncFeatureToggle(UUID syncFeatureToggleUuid) {
        SyncFeatureToggle syncFeatureToggle = repository.findById(syncFeatureToggleUuid)
            .orElseThrow(EntityNotFoundException::new);

        return syncFeatureToggle;
    }

    public SyncFeatureToggle getActiveSyncFeatureToggle() {
        SyncFeatureToggle syncFeatureToggle = repository.findActive()
            .orElseThrow(EntityNotFoundException::new);

        return syncFeatureToggle;
    }

    public List<SyncFeatureToggle> listSyncFeatureToggle() {
        return repository.listAll();
    }
}

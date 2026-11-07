package com.storecontrol.backend.repositories.integration;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.storecontrol.backend.models.integration.SyncFeatureToggle;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SyncFeatureToggleRepository extends JpaRepository<SyncFeatureToggle, UUID> {

    Optional<SyncFeatureToggle> findById(UUID id);

    Optional<SyncFeatureToggle> findByFeatureName(String featureName);

    @Query("SELECT sft FROM SyncFeatureToggle sft WHERE sft.enabled = true")
    Optional<SyncFeatureToggle> findActive();

    @Query("SELECT sft FROM SyncFeatureToggle sft")
    List<SyncFeatureToggle> listAll();
}

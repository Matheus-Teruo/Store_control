package com.storecontrol.backend.repositories.polling;

import org.springframework.data.jpa.repository.JpaRepository;
import com.storecontrol.backend.models.polling.SyncFeatureToggle;

import java.util.Optional;
import java.util.UUID;

public interface SyncFeatureToggleRepository extends JpaRepository<SyncFeatureToggle, UUID> {

    Optional<SyncFeatureToggle> findByFeatureName(String featureName);
}

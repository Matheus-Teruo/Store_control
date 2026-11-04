package com.storecontrol.backend.models.integration;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity 
@Table (name = "sync_config")
@Getter 
@NoArgsConstructor
@AllArgsConstructor
public class SyncFeatureToggle {
    @Id 
    @GeneratedValue(generator = "UUID")
    private UUID id;

    @Column(name = "feature_name", unique = true, nullable = false)
    private String featureName;

    @Column(nullable = false)
    private String origin;

    @Column(name = "event_linked", nullable = false)
    private UUID eventLinked;

    @Column(name = "enabled", nullable = false)
    private Boolean enabled;
}

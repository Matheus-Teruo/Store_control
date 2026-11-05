package com.storecontrol.backend.repositories.integration;

import org.springframework.data.jpa.repository.JpaRepository;

import com.storecontrol.backend.models.integration.ProcessedOrder;

import java.util.UUID;

public interface ProcessedSaleRepository extends JpaRepository<ProcessedOrder, UUID> {
    boolean existsByExternalSaleId(String externalSaleId);
}

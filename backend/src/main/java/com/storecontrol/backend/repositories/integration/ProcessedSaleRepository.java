package com.storecontrol.backend.repositories.integration;

import org.springframework.data.jpa.repository.JpaRepository;

import com.storecontrol.backend.models.integration.ProcessedSale;

import java.util.UUID;

public interface ProcessedSaleRepository extends JpaRepository<ProcessedSale, UUID> {
    boolean existsByExternalSaleId(String externalSaleId);
}

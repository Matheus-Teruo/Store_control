package com.storecontrol.backend.repositories.integration;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.storecontrol.backend.models.integration.ProcessedOrder;

import java.util.Optional;
import java.util.UUID;

public interface ProcessedOrderRepository extends JpaRepository<ProcessedOrder, UUID> {
    boolean existsByExternalSaleId(String externalSaleId);

    @Query("SELECT po FROM ProcessedOrder po WHERE po.externalSaleId = :externalSaleId")
    Optional<ProcessedOrder> findByExternalSaleId(String externalSaleId);
}

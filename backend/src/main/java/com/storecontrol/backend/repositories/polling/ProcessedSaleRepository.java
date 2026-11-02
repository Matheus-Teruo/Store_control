package com.storecontrol.backend.repositories.polling;

import org.springframework.data.jpa.repository.JpaRepository;
import com.storecontrol.backend.models.polling.ProcessedSale;

import java.util.UUID;

public interface ProcessedSaleRepository extends JpaRepository<ProcessedSale, UUID> {
    boolean existsByExternalSaleId(String externalSaleId);
}

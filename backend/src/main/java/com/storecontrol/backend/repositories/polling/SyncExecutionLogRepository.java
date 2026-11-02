package com.storecontrol.backend.repositories.polling;

import org.springframework.data.jpa.repository.JpaRepository;

import com.storecontrol.backend.models.polling.SalePollingStatus;
import com.storecontrol.backend.models.polling.SyncExecutionLog;

import java.util.Optional;
import java.util.UUID;

public interface SyncExecutionLogRepository extends JpaRepository<SyncExecutionLog, UUID> {

    Optional<SyncExecutionLog> findTopByStatusOrderByIdDesc(SalePollingStatus status);
}
package com.storecontrol.backend.models.polling;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Table(name = "sync_execution_log")
@AllArgsConstructor
@NoArgsConstructor
public class SyncExecutionLog {
    @Id
    @GeneratedValue(generator = "UUID")
    private UUID id;

    @Column(name = "sync_started_at", nullable = false)
    private LocalDateTime syncStartedAt;

    @Column(name = "sync_finished_at", nullable = false)
    private LocalDateTime syncFinishedAt;

    @Column(name = "sales_processed_count")
    private Integer salesProcessedCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SalePollingStatus status;

    public SyncExecutionLog(LocalDateTime syncStartedAt, LocalDateTime syncFinishedAt, Integer salesProcessedCount, SalePollingStatus status) {
        this.syncStartedAt = syncStartedAt;
        this.syncFinishedAt = syncFinishedAt;
        this.salesProcessedCount = salesProcessedCount;
        this.status = status;
    }
}

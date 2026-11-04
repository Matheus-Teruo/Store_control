package com.storecontrol.backend.models.integration;

import java.time.LocalDateTime;
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
@Table(name = "tb_processed_sale")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProcessedSale {

    @Id 
    @GeneratedValue(generator = "UUID")
    private UUID id;

    @Column(name = "external_sale_id", nullable = false, unique = true)
    private String externalSaleId;

    @Column(name = "external_sale_field", nullable = false, unique = true)
    private String externalSaleField;

    @Column(name = "processed_at", nullable = false)
    private LocalDateTime processedAt;

    public ProcessedSale(String externalId, String externalField, LocalDateTime processedAt){
        this.externalSaleId = externalId;
        this.externalSaleField = externalField;
        this.processedAt = processedAt;
    }
}

package com.storecontrol.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "donations")
@Getter
@NoArgsConstructor
public class Donation {
    @Id @GeneratedValue(generator = "UUID")
    private UUID uuid;
    @Column(name = "donation_value")
    private BigDecimal donationValue;
    @Column(name = "donation_time_stamp")
    private LocalDateTime donationTimeStamp;
    @OneToOne @JoinColumn(name = "customer_uuid")
    private Customer customer;
    @ManyToOne @JoinColumn(name = "voluntary_uuid")
    private Voluntary voluntary;
    private Boolean valid;
}

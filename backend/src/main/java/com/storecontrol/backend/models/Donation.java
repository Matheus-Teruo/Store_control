package com.storecontrol.backend.models;

import com.storecontrol.backend.controllers.request.donation.RequestDonation;
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

    public Donation(RequestDonation request, Customer customer, Voluntary voluntary) {
        this.donationValue = new BigDecimal(request.donationValue());
        this.donationTimeStamp = LocalDateTime.now();
        this.customer = customer;
        this.voluntary = voluntary;
        this.valid = true;
    }

    public void deleteDonation() {
        this.valid = false;
    }
}

package com.storecontrol.backend.models.operations;

import com.storecontrol.backend.models.customers.request.RequestAuxFinalizeCustomer;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.volunteers.Voluntary;
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

    @Column(name = "donation_value", nullable = false)
    private BigDecimal donationValue;

    @Column(name = "donation_time_stamp", nullable = false)
    private LocalDateTime donationTimeStamp;

    @ManyToOne @JoinColumn(name = "customer_uuid", nullable = false)
    private Customer customer;

    @ManyToOne @JoinColumn(name = "voluntary_uuid", nullable = false)
    private Voluntary voluntary;

    @Column(nullable = false)
    private boolean valid;


    public Donation(RequestAuxFinalizeCustomer request,
                    Customer customer,
                    Voluntary voluntary) {
        this.donationValue = request.donationValue();
        this.donationTimeStamp = LocalDateTime.now();
        this.customer = customer;
        this.voluntary = voluntary;
        this.valid = true;
    }

    public void deleteDonation() {
        this.valid = false;
    }
}

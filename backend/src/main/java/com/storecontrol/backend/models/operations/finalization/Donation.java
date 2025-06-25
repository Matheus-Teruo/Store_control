package com.storecontrol.backend.models.operations.finalization;

import com.storecontrol.backend.models.customers.request.RequestCustomerFinalization;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.registers.Register;
import com.storecontrol.backend.models.volunteers.Voluntary;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "donations")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Donation {

    @Id @GeneratedValue(generator = "UUID")
    private UUID uuid;

    @Column(name = "donation_value", nullable = false)
    private BigDecimal donationValue;

    @Column(name = "donation_timestamp", nullable = false)
    private LocalDateTime donationTimestamp;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "customer_uuid", nullable = false)
    private Customer customer;

    @Column(name = "register_uuid", insertable = false, updatable = false)
    private UUID registerUuid;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "register_uuid", nullable = false)
    private Register register;

    @Column(name = "voluntary_uuid", insertable = false, updatable = false)
    private UUID voluntaryUuid;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "voluntary_uuid", nullable = false)
    private Voluntary voluntary;

    @Column(nullable = false)
    private boolean valid;


    public Donation(RequestCustomerFinalization request,
                    Customer customer,
                    Register register,
                    Voluntary voluntary) {
        this.donationValue = request.donationValue();
        this.donationTimestamp = LocalDateTime.now();
        this.customer = customer;
        this.register = register;
        this.voluntary = voluntary;
        this.valid = true;
    }

    public void deleteDonation() {
        this.valid = false;
    }
}

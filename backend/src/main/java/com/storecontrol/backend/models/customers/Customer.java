package com.storecontrol.backend.models.customers;

import com.storecontrol.backend.models.operations.Donation;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.operations.Refund;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "customers")
@Getter
@NoArgsConstructor
public class Customer {

    @Id @GeneratedValue(generator = "UUID")
    private UUID uuid;

    @ManyToOne @JoinColumn(name = "order_card_id", nullable = false)
    private OrderCard orderCard;

    @Column(name = "customer_start", nullable = false)
    private LocalDateTime customerStart;

    @Column(name = "customer_end")
    private LocalDateTime customerEnd;

    @Setter @OneToMany(mappedBy = "customer")
    private List<Recharge> recharges;

    @Setter @OneToMany(mappedBy = "customer")
    private List<Purchase> purchases;

    @Setter @OneToMany(mappedBy = "customer")
    private List<Donation> donations;

    @Setter @OneToMany(mappedBy = "customer")
    private List<Refund> refunds;

    @Column(name = "in_use", nullable = false)
    private boolean inUse;


    public Customer(OrderCard orderCard) {
        this.orderCard = orderCard;
        this.customerStart = LocalDateTime.now();
        this.inUse = true;
    }

    public void undoFinalizeCustomer() {
        this.customerEnd = null;
        this.inUse = true;
    }

    public void finalizeCustomer() {
        this.customerEnd = LocalDateTime.now();
        this.inUse = false;
    }
}

package com.storecontrol.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
    @ManyToOne @JoinColumn(name = "card_id")
    private OrderCard orderCard;
    @Column(name = "customer_start")
    private LocalDateTime customerStart;
    @Column(name = "customer_end")
    private LocalDateTime customerEnd;
    @OneToMany(mappedBy = "customer")
    private List<Recharge> recharges;
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Sale> sales;
    @OneToOne(mappedBy = "customer")
    private Donation donation;
    @Column(name = "in_use")
    private Boolean inUse;
    @ManyToOne @JoinColumn(name = "voluntary_id")
    private Voluntary voluntary;
}

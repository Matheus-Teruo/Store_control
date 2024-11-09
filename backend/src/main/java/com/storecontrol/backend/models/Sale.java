package com.storecontrol.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "sales")
@Getter
@NoArgsConstructor
public class Sale {
    @Id @GeneratedValue(generator = "UUID")
    private UUID uuid;
    @Column(name = "on_order")
    private Boolean onOrder;
    @Column(name = "sale_time_stamp")
    private LocalDateTime saleTimeStamp;
    @OneToMany(mappedBy = "goodId.sale", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Good> goods;
    @ManyToOne @JoinColumn(name = "customer_id")
    private Customer customer;
    @ManyToOne @JoinColumn(name = "voluntary_id")
    private Voluntary voluntary;
    private Boolean valid;
}

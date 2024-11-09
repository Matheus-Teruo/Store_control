package com.storecontrol.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "order_cards")
@Getter
@NoArgsConstructor
public class OrderCard {
    @Id @Column(name = "card_id")
    private String id;
    private BigDecimal debit;
    @OneToMany(mappedBy = "orderCard")
    private List<Customer> curtomers;
    private Boolean active;
}

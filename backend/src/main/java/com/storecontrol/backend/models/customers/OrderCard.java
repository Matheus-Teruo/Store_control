package com.storecontrol.backend.models.customers;

import com.storecontrol.backend.controllers.customers.request.RequestOrderCard;
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

    @Column(nullable = false)
    private BigDecimal debit;

    @OneToMany(mappedBy = "orderCard")
    private List<Customer> customers;

    @Column(nullable = false)
    private boolean active;


    public OrderCard(RequestOrderCard request) {
        this.id = request.id();
        this.debit = BigDecimal.ZERO;
        this.active = false;
    }

    public void updateActive(Boolean value) {
        this.active = value;
    }

    public void incrementDebit(BigDecimal value) {
        this.debit = debit.add(value);
    }
}

package com.storecontrol.backend.models;

import com.storecontrol.backend.controllers.request.orderCard.RequestCard;
import com.storecontrol.backend.controllers.request.orderCard.RequestUpdateCard;
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

    public OrderCard(RequestCard request) {
        this.id = request.id();
        this.debit = BigDecimal.ZERO;
    }

    public void updateOrderCard(RequestUpdateCard request) {
        if (request.debit() != null) {
            this.debit = new BigDecimal(request.debit());
        }
        if (request.active() != null) {
            this.active = request.active();
        }
    }
}

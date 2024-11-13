package com.storecontrol.backend.models;

import com.storecontrol.backend.controllers.request.orderCard.RequestOrderCard;
import com.storecontrol.backend.controllers.request.orderCard.RequestUpdateOrderCard;
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

    public OrderCard(RequestOrderCard request) {
        this.id = request.id();
        this.debit = BigDecimal.ZERO;
        this.active = false;
    }

    public void updateOrderCard(RequestUpdateOrderCard request) {
        if (request.debit() != null) {
            this.debit = new BigDecimal(request.debit());
        }
        if (request.active() != null) {
            this.active = request.active();
        }
    }

    public void incrementDebit(String value) {
        this.debit = debit.add(new BigDecimal(value));
    }
}

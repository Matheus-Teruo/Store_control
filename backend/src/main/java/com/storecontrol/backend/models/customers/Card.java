package com.storecontrol.backend.models.customers;

import com.storecontrol.backend.models.customers.request.RequestCard;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "cards")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Card {

    @Id @Column(name = "card_id")
    private String id;

    @Column(nullable = false)
    private BigDecimal debit;

    @OneToMany(mappedBy = "card")
    private List<Customer> customers;

    @Column(nullable = false)
    private boolean active;


    public Card(RequestCard request) {
        this.id = request.cardId();
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

package com.storecontrol.backend.models;

import com.storecontrol.backend.controllers.request.recharge.RequestRecharge;
import com.storecontrol.backend.controllers.request.recharge.RequestUpdateRecharge;
import com.storecontrol.backend.models.enumerate.PaymentType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "recharges")
@Getter
@NoArgsConstructor
public class Recharge {
    @Id @GeneratedValue(generator = "UUID")
    private UUID uuid;
    @Column(name = "recharge_value")
    private BigDecimal rechargeValue;
    @Column(name = "recharge_time_stamp")
    private LocalDateTime rechargeTimeStamp;
    @Column(name = "payment_type")
    @Enumerated(EnumType.STRING)
    private PaymentType paymentTypeEnum;
    @ManyToOne @JoinColumn(name = "customer_uuid")
    private Customer customer;
    @ManyToOne @JoinColumn(name = "voluntary_uuid")
    private Voluntary voluntary;
    private Boolean valid;

    public Recharge(RequestRecharge request, Customer customer, Voluntary voluntary) {
        this.rechargeValue = new BigDecimal(request.rechargeValue());
        this.rechargeTimeStamp = LocalDateTime.now();
        this.paymentTypeEnum = PaymentType.fromString(request.paymentTypeEnum());
        this.customer = customer;
        this.voluntary = voluntary;
        this.valid = true;
    }

    public void updateRecharge(RequestUpdateRecharge request) {
        if (request.rechargeValue() != null) {
            this.rechargeValue = new BigDecimal(request.rechargeValue());
        }
        if (request.paymentTypeEnum() != null) {
            this.paymentTypeEnum = PaymentType.fromString(request.paymentTypeEnum());
        }
    }

    public void deleteRecharge() {
        this.valid = false;
    }
}

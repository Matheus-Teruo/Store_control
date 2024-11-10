package com.storecontrol.backend.models;

import com.storecontrol.backend.models.enumerate.PaymentType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
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
    private Enum<PaymentType> paymentTypeEnum;
    @ManyToOne @JoinColumn(name = "customer_id")
    private Customer customer;
    @ManyToOne @JoinColumn(name = "voluntary_id")
    private Voluntary voluntary;
    private Boolean valid;
}

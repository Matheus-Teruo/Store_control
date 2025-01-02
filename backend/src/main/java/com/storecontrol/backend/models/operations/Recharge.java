package com.storecontrol.backend.models.operations;

import com.storecontrol.backend.models.operations.request.RequestCreateRecharge;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.registers.CashRegister;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.models.enumerate.PaymentType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "recharges")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Recharge {

    @Id @GeneratedValue(generator = "UUID")
    private UUID uuid;

    @Column(name = "recharge_value", nullable = false)
    private BigDecimal rechargeValue;

    @Column(name = "recharge_time_stamp", nullable = false)
    private LocalDateTime rechargeTimeStamp;

    @Column(name = "payment_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentType paymentTypeEnum;

    @ManyToOne @JoinColumn(name = "customer_uuid", nullable = false)
    private Customer customer;

    @ManyToOne @JoinColumn(name = "cash_register_uuid", nullable = false)
    private CashRegister cashRegister;

    @Column(name = "voluntary_uuid", insertable = false, updatable = false)
    private UUID voluntaryUuid;

    @ManyToOne @JoinColumn(name = "voluntary_uuid", nullable = false)
    private Voluntary voluntary;

    @Column(nullable = false)
    private boolean valid;


    public Recharge(RequestCreateRecharge request,
                    Customer customer,
                    CashRegister cashRegister,
                    Voluntary voluntary) {
        this.rechargeValue = request.rechargeValue();
        this.rechargeTimeStamp = LocalDateTime.now();
        this.paymentTypeEnum = PaymentType.fromString(request.paymentTypeEnum());
        this.customer = customer;
        this.cashRegister = cashRegister;
        this.voluntary = voluntary;
        this.valid = true;
    }

    public void deleteRecharge() {
        this.valid = false;
    }
}

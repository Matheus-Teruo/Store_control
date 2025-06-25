package com.storecontrol.backend.models.operations.recharges;

import com.storecontrol.backend.models.operations.recharges.request.RequestCreateRecharge;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.registers.Register;
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

    @Column(name = "payment_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentType paymentTypeEnum;

    @Column(name = "recharge_timestamp", nullable = false)
    private LocalDateTime rechargeTimestamp;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "customer_uuid", nullable = false)
    private Customer customer;

    @Column(name = "register_uuid", insertable = false, updatable = false)
    private UUID registerUuid;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "register_uuid", nullable = false)
    private Register register;

    @Column(name = "voluntary_uuid", insertable = false, updatable = false)
    private UUID voluntaryUuid;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "voluntary_uuid", nullable = false)
    private Voluntary voluntary;

    @Column(nullable = false)
    private boolean valid;


    public Recharge(RequestCreateRecharge request,
                    Customer customer,
                    Register register,
                    Voluntary voluntary) {
        this.rechargeValue = request.rechargeValue();
        this.paymentTypeEnum = PaymentType.fromString(request.paymentTypeEnum());
        this.rechargeTimestamp = LocalDateTime.now();
        this.customer = customer;
        this.register = register;
        this.voluntary = voluntary;
        this.valid = true;
    }

    public void deleteRecharge() {
        this.valid = false;
    }
}

package com.storecontrol.backend.models;

import com.storecontrol.backend.models.enumerate.PaymentType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class Recharge {
    private UUID uuid;
    private BigDecimal recharge;
    private LocalDateTime recharge_time_stamp;
    private Enum<PaymentType> paymentTypeEnum;
    private List<OrderCard> orderCards;
    private List<User> users;
    private Boolean active;
}

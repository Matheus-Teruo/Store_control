package com.storecontrol.backend.models;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class Donation {
    private UUID uuid;
    private BigDecimal value;
    private LocalDateTime donation_time_stamp;
    private OrderCard orderCard;
    private User user;
    private Boolean active;
}

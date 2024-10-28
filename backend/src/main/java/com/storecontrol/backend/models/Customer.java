package com.storecontrol.backend.models;

import java.time.LocalDateTime;
import java.util.UUID;

public class Customer {
    private UUID uuid;
    private OrderCard card;
    private LocalDateTime customer_time_stamp;
    private Boolean in_use;
    private User user;
}

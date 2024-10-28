package com.storecontrol.backend.models;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class Sale {
    private UUID uuid;
    private User user;
    private OrderCard card;
    private Boolean onOrder;
    private List<Good> goods;
    private LocalDateTime sale_time_stamp;
    private Boolean valid;
}

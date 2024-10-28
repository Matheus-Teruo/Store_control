package com.storecontrol.backend.models;

import java.math.BigDecimal;
import java.util.UUID;

public class Item {
    private UUID uuid;
    private String item;
    private BigDecimal price;
    private Integer stock;
    private String item_img;
    private Stand stand;
    private Boolean active;
}

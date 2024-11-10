package com.storecontrol.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "goods")
@Getter
@NoArgsConstructor
public class Good {
    @EmbeddedId
    private GoodID goodId;
    private Integer quantity;
    @Column(name = "unit_price")
    private BigDecimal unitPrice;
    private Boolean valid;
}

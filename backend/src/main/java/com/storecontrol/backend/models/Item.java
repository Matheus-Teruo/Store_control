package com.storecontrol.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "items")
@Getter
@NoArgsConstructor
public class Item {
    @Id @GeneratedValue(generator = "UUID")
    private UUID uuid;
    @Column(name = "item_name")
    private String itemName;
    private BigDecimal price;
    private Integer stock;
    @Column(name = "item_img")
    private String itemImg;
    @ManyToOne @JoinColumn(name = "stand_id")
    private Stand stand;
    @OneToMany(mappedBy = "goodId.item")
    private List<Good> goods;
    private Boolean active;
}

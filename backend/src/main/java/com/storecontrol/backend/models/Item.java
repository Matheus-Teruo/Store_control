package com.storecontrol.backend.models;

import com.storecontrol.backend.controllers.request.item.RequestItem;
import com.storecontrol.backend.controllers.request.item.RequestUpdateItem;
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
    @ManyToOne @JoinColumn(name = "stand_uuid")
    private Stand stand;
    @OneToMany(mappedBy = "purchaseItemId.item")
    private List<PurchaseItem> purchaseItems;
    private Boolean valid;

    public Item(RequestItem request, Stand stand) {
        this.itemName = request.itemName();
        this.price = new BigDecimal(request.price());
        this.stock = request.stock();
        if (request.itemImg() != null) {
            this.itemImg = request.itemImg();
        }
        this.stand = stand;
        this.valid = true;
    }

    public void updateItem(RequestUpdateItem request) {
        if (request.itemName() != null) {
            this.itemName = request.itemName();
        }
        if (request.price() != null) {
            this.price = new BigDecimal(request.price());
        }
        if (request.stock() != null) {
            this.stock = request.stock();
        }
        if (request.itemImg() != null) {
            this.itemImg = request.itemImg();
        }
    }

    public void updateItem(Stand stand) {
        this.stand = stand;
    }

    public void deleteItem() {
        this.valid = false;
    }
}

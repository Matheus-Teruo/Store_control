package com.storecontrol.backend.models;

import com.storecontrol.backend.controllers.request.item.RequestItem;
import com.storecontrol.backend.controllers.request.item.RequestUpdateItem;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "items")
@Getter
@NoArgsConstructor
public class Item {
    @EmbeddedId
    private ItemId itemId;
    private Integer quantity;
    private Integer delivered;
    @Column(name = "unit_price")
    private BigDecimal unitPrice;
    private Boolean valid;

    public Item(RequestItem requestItem, ItemId ItemId) {
        this.itemId = ItemId;
        this.quantity = requestItem.quantity();
        if (requestItem.delivered() != null) {
            this.delivered = requestItem.delivered();
        }
        this.unitPrice = new BigDecimal(requestItem.unitPrice());
        this.valid = true;
    }

    public void updateItem(RequestUpdateItem request) {
        this.delivered = request.delivered();
    }

    public void deleteItem() {
        this.valid = false;
    }
}

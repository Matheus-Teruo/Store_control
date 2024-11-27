package com.storecontrol.backend.models.operations.purchases;

import com.storecontrol.backend.models.operations.purchases.request.RequestCreateItem;
import com.storecontrol.backend.models.operations.purchases.request.RequestUpdateItem;
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

    @Column(nullable = false)
    private int quantity;

    private Integer delivered;

    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private BigDecimal discount;

    @Column(nullable = false)
    private boolean valid;


    public Item(RequestCreateItem request, ItemId ItemId) {
        this.itemId = ItemId;
        this.quantity = request.quantity();
        this.delivered = request.delivered();
        this.unitPrice = request.unitPrice();
        this.discount = request.discount();
        this.valid = true;
    }

    public void updateItem(RequestUpdateItem request) {
        this.delivered = request.delivered();
    }

    public void deleteItem() {
        this.valid = false;
    }
}

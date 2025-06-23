package com.storecontrol.backend.models.operations.purchases;

import com.storecontrol.backend.models.operations.purchases.request.RequestCreateItem;
import com.storecontrol.backend.models.operations.purchases.request.RequestUpdateItem;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "items")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Item {

    @EmbeddedId
    private ItemId itemId;

    @Column(name = "product_uuid", insertable = false, updatable = false)
    private UUID productUuid;

    @Column(nullable = false)
    private int quantity;

    private Integer delivered;

    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private BigDecimal discount;

    @Column(nullable = false)
    private boolean valid;


    public Item(RequestCreateItem request, ItemId itemId) {
        this.itemId = itemId;
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

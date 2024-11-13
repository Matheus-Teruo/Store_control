package com.storecontrol.backend.models;

import com.storecontrol.backend.controllers.request.purchaseItem.RequestPurchaseItem;
import com.storecontrol.backend.controllers.request.purchaseItem.RequestUpdatePurchaseItem;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "purchase_items")
@Getter
@NoArgsConstructor
public class PurchaseItem {
    @EmbeddedId
    private PurchaseItemId purchaseItemId;
    private Integer quantity;
    private Integer delivered;
    @Column(name = "unit_price")
    private BigDecimal unitPrice;
    private Boolean valid;

    public PurchaseItem(RequestPurchaseItem requestPurchaseItem, PurchaseItemId purchaseItemId) {
        this.purchaseItemId = purchaseItemId;
        this.quantity = requestPurchaseItem.quantity();
        if (requestPurchaseItem.delivered() != null) {
            this.delivered = requestPurchaseItem.delivered();
        }
        this.unitPrice = new BigDecimal(requestPurchaseItem.unitPrice());
        this.valid = true;
    }

    public void updatePurchaseItem(RequestUpdatePurchaseItem request) {
        if (request.delivered() != null) {
            if (request.delivered() <= this.quantity) {
                this.delivered = request.delivered();
            } else {
                // TODO: error quantity not allow to be bigger than quantity.
            }
        }
    }

    public void deletePurchaseItem() {
        this.valid = false;
    }
}

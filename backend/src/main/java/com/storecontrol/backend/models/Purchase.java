package com.storecontrol.backend.models;

import com.storecontrol.backend.controllers.request.purchaseItem.RequestUpdatePurchaseItem;
import com.storecontrol.backend.controllers.request.purchase.RequestPurchase;
import com.storecontrol.backend.controllers.request.purchase.RequestUpdatePurchase;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Entity
@Table(name = "purchases")
@Getter
@NoArgsConstructor
public class Purchase {
    @Id @GeneratedValue(generator = "UUID")
    private UUID uuid;
    @Column(name = "on_order")
    private Boolean onOrder;
    @Column(name = "purchase_time_stamp")
    private LocalDateTime purchaseTimeStamp;
    @OneToMany(mappedBy = "purchaseItemId.purchase", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<PurchaseItem> purchaseItems;
    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "customer_uuid")
    private Customer customer;
    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "voluntary_uuid")
    private Voluntary voluntary;
    private Boolean valid;

    public Purchase(RequestPurchase request, Customer customer, Voluntary voluntary) {
        this.onOrder = request.onOrder();
        this.purchaseTimeStamp = LocalDateTime.now();
        this.customer = customer;
        this.voluntary = voluntary;
        this.valid = true;
    }

    public void allocatePurchaseItemsToPurchase(List<PurchaseItem> purchaseItems) {
        this.purchaseItems = purchaseItems;
    }

    public void updatePurchase(RequestUpdatePurchase request) {
        if (request.onOrder() != null){
            this.onOrder = request.onOrder();
        }
    }

    public void updatePurchaseItemsFromPurchase(List<RequestUpdatePurchaseItem> request) {
        if (request != null && !request.isEmpty()) {

            var purchaseItemsMap = this.purchaseItems.stream().collect(Collectors.toMap(
                purchaseItem -> purchaseItem.getPurchaseItemId().getItem().getUuid().toString(),
                purchaseItem -> purchaseItem
            ));

            request.forEach(requestUpdatePurchaseItem -> {
                var purchaseItem = purchaseItemsMap.get(requestUpdatePurchaseItem.itemId());
                if (purchaseItem != null) {
                    purchaseItem.updatePurchaseItem(requestUpdatePurchaseItem);
                } else {
                    // TODO: error. this item is not allocate in this purchase like purchaseItem
                }
            });
        }
    }

    public void deletePurchase() {
        this.valid = false;

        this.purchaseItems.forEach(PurchaseItem::deletePurchaseItem);
    }
}

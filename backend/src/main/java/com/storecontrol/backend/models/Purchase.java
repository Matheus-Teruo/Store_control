package com.storecontrol.backend.models;

import com.storecontrol.backend.controllers.request.purchase.RequestPurchase;
import com.storecontrol.backend.controllers.request.purchase.RequestUpdatePurchase;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

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

    public void deletePurchase() {
        this.valid = false;

        this.purchaseItems.forEach(PurchaseItem::deletePurchaseItem);
    }
}

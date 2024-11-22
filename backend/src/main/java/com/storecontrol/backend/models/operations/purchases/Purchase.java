package com.storecontrol.backend.models.operations.purchases;

import com.storecontrol.backend.models.operations.purchases.request.RequestPurchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestUpdatePurchase;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.volunteers.Voluntary;
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

    @Column(name = "on_order", nullable = false)
    private boolean onOrder;

    @Column(name = "purchase_time_stamp", nullable = false)
    private LocalDateTime purchaseTimeStamp;

    @OneToMany(mappedBy = "itemId.purchase", fetch = FetchType.EAGER)
    private List<Item> items;

    @ManyToOne @JoinColumn(name = "customer_uuid", nullable = false)
    private Customer customer;

    @ManyToOne @JoinColumn(name = "voluntary_uuid", nullable = false)
    private Voluntary voluntary;

    @Column(nullable = false)
    private boolean valid;


    public Purchase(RequestPurchase request, Customer customer, Voluntary voluntary) {
        this.onOrder = request.onOrder();
        this.purchaseTimeStamp = LocalDateTime.now();
        this.customer = customer;
        this.voluntary = voluntary;
        this.valid = true;
    }

    public void allocateItemsToPurchase(List<Item> items) {
        this.items = items;
    }

    public void updatePurchase(RequestUpdatePurchase request) {
        if (request.onOrder() != null){
            this.onOrder = request.onOrder();
        }
    }

    public void deletePurchase() {
        this.valid = false;

        this.items.forEach(Item::deleteItem);
    }
}

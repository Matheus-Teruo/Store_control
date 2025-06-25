package com.storecontrol.backend.models.operations.purchases;

import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.volunteers.Voluntary;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "purchases")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Purchase {

    @Id @GeneratedValue(generator = "UUID")
    private UUID uuid;

    @Column(name = "on_order", nullable = false)
    private boolean onOrder;

    @Column(name = "purchase_timestamp", nullable = false)
    private LocalDateTime purchaseTimestamp;

    @Column(name = "stand_uuid", nullable = false)
    private UUID standUuid;

    @Setter
    @OneToMany(mappedBy = "itemId.purchase", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Item> items;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_uuid", nullable = false)
    private Customer customer;

    @Column(name = "voluntary_uuid", insertable = false, updatable = false)
    private UUID voluntaryUuid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voluntary_uuid", nullable = false)
    private Voluntary voluntary;

    @Column(nullable = false)
    private boolean reversal;

    @Column(nullable = false)
    private boolean valid;


    public Purchase(boolean onOrder, UUID standUuid, Customer customer, Voluntary voluntary, boolean reversal) {
        this.onOrder = onOrder;
        this.purchaseTimestamp = LocalDateTime.now();
        this.standUuid = standUuid;
        this.customer = customer;
        this.voluntary = voluntary;
        this.reversal = reversal;
        this.valid = true;
    }

    public void updatePurchase(boolean onOrder) {
        this.onOrder = onOrder;
    }

    public void deletePurchase() {
        this.valid = false;

        this.items.forEach(Item::deleteItem);
    }
}

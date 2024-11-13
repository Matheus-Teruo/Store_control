package com.storecontrol.backend.models;

import com.storecontrol.backend.controllers.request.good.RequestUpdateGood;
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
    @OneToMany(mappedBy = "goodId.purchase", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Good> goods;
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

    public void allocateGoodsToPurchase(List<Good> goods) {
        this.goods = goods;
    }

    public void updatePurchase(RequestUpdatePurchase request) {
        if (request.onOrder() != null){
            this.onOrder = request.onOrder();
        }
    }

    public void updateGoodsFromPurchase(List<RequestUpdateGood> request) {
        if (request != null && !request.isEmpty()) {

            var goodsMap = this.goods.stream().collect(Collectors.toMap(
                good -> good.getGoodId().getItem().getUuid().toString(),
                good -> good
            ));

            request.forEach(requestUpdateGood -> {
                var good = goodsMap.get(requestUpdateGood.itemId());
                if (good != null) {
                    good.updateGood(requestUpdateGood);
                } else {
                    // TODO: error. this item is not allocate in this purchase like good
                }
            });
        }
    }

    public void deletePurchase() {
        this.valid = false;

        this.goods.forEach(Good::deleteGood);
    }
}

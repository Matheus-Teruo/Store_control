package com.storecontrol.backend.models;

import com.storecontrol.backend.controllers.request.good.RequestUpdateGood;
import com.storecontrol.backend.controllers.request.sale.RequestSale;
import com.storecontrol.backend.controllers.request.sale.RequestUpdateSale;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Entity
@Table(name = "sales")
@Getter
@NoArgsConstructor
public class Sale {
    @Id @GeneratedValue(generator = "UUID")
    private UUID uuid;
    @Column(name = "on_order")
    private Boolean onOrder;
    @Column(name = "sale_time_stamp")
    private LocalDateTime saleTimeStamp;
    @OneToMany(mappedBy = "goodId.sale", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Good> goods;
    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "customer_uuid")
    private Customer customer;
    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "voluntary_uuid")
    private Voluntary voluntary;
    private Boolean valid;

    public Sale(RequestSale request, Customer customer, Voluntary voluntary) {
        this.onOrder = request.onOrder();
        this.saleTimeStamp = LocalDateTime.now();
        this.customer = customer;
        this.voluntary = voluntary;
        this.valid = true;
    }

    public void allocateGoodsToSale(List<Good> goods) {
        this.goods = goods;
    }

    public void updateSale(RequestUpdateSale request) {
        if (request.onOrder() != null){
            this.onOrder = request.onOrder();
        }
    }

    public void updateGoodsFromSale(List<RequestUpdateGood> request) {
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
                    // TODO: error. this item is not allocate in this sale like good
                }
            });
        }
    }

    public void deleteSale() {
        this.valid = false;

        this.goods.forEach(Good::deleteSale);
    }
}

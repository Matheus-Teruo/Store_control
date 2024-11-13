package com.storecontrol.backend.models;

import com.storecontrol.backend.controllers.request.good.RequestGood;
import com.storecontrol.backend.controllers.request.good.RequestUpdateGood;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "goods")
@Getter
@NoArgsConstructor
public class Good {
    @EmbeddedId
    private GoodID goodId;
    private Integer quantity;
    private Integer delivered;
    @Column(name = "unit_price")
    private BigDecimal unitPrice;
    private Boolean valid;

    public Good(RequestGood requestGood, GoodID goodId) {
        this.goodId = goodId;
        this.quantity = requestGood.quantity();
        if (requestGood.delivered() != null) {
            this.delivered = requestGood.delivered();
        }
        this.unitPrice = new BigDecimal(requestGood.unitPrice());
        this.valid = true;
    }

    public void updateGood(RequestUpdateGood request) {
        if (request.delivered() != null) {
            if (request.delivered() <= this.quantity) {
                this.delivered = request.delivered();
            } else {
                // TODO: error quantity not allow to be bigger than quantity.
            }
        }
    }

    public void deleteGood() {
        this.valid = false;
    }
}

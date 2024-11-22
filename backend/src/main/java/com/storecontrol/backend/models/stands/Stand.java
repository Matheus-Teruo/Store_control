package com.storecontrol.backend.models.stands;

import com.storecontrol.backend.models.stands.request.RequestStand;
import com.storecontrol.backend.models.stands.request.RequestUpdateStand;
import com.storecontrol.backend.models.volunteers.Function;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "stands")
@Getter
@NoArgsConstructor
public class Stand extends Function {

    @ManyToOne @JoinColumn(name = "association_uuid", nullable = false)
    private Association association;

    @OneToMany(mappedBy = "stand")
    private List<Product> products;


    public Stand(RequestStand request, Association association) {
        super(request.standName());
        this.association = association;
    }

    public void updateStand(RequestUpdateStand request) {
        if (request.standName() != null) {
            super.updateFunctionName(request.standName());
        }
    }

    public void updateStand(Association association) {
        this.association = association;
    }

    @Override
    public void deleteFunction() {
        super.deleteFunction();

        for (Product product : products) {
            product.deleteProduct();
        }
    }
}

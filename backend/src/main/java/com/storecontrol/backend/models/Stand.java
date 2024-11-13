package com.storecontrol.backend.models;

import com.storecontrol.backend.controllers.request.stand.RequestStand;
import com.storecontrol.backend.controllers.request.stand.RequestUpdateStand;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "stands")
@Getter
@NoArgsConstructor
public class Stand {
    @Id @GeneratedValue(generator = "UUID")
    private UUID uuid;
    @Column(name = "stand_name")
    private String standName;
    @ManyToOne @JoinColumn(name = "association_uuid")
    private Association association;
    @OneToMany(mappedBy = "stand")
    private List<Voluntary> volunteers;
    @OneToMany(mappedBy = "stand")
    private List<Item> items;
    private Boolean valid;

    public Stand(RequestStand request, Association association) {
        this.standName = request.standName();
        this.association = association;
        this.valid = true;
    }

    public void updateStand(RequestUpdateStand request) {
        if (request.standName() != null) {
            this.standName = request.standName();
        }
    }

    public void updateStand(Association association) {
        this.association = association;
    }

    public void deleteStand() {
        this.valid = false;
    }
}

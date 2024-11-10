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
    private String stand;
    @ManyToOne @JoinColumn(name = "association_id")
    private Association association;
    @OneToMany(mappedBy = "stand")
    private List<Voluntary> volunteers;
    @OneToMany(mappedBy = "stand")
    private List<Item> items;
    private Boolean valid;

    public Stand(RequestStand request) {
        this.stand = request.stand();
        this.association = request.association();
        this.valid = true;
    }

    public void updateStand(RequestUpdateStand request) {
        if (request.stand() != null) {
            this.stand = request.stand();
        }
        if (request.association() != null) {
            this.association = request.association();
        }
    }

    public void deleteStand() {
        this.valid = false;
    }
}

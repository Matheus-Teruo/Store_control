package com.storecontrol.backend.models;

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
}

package com.storecontrol.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "associations")
@Getter
@NoArgsConstructor
public class Association {
    @Id @GeneratedValue(generator = "UUID")
    private UUID uuid;
    private String association;
    @Column(name = "principal_name")
    private String principalName;
    @OneToOne @JoinColumn(name = "principal_id")
    private Voluntary principal;
    @OneToMany(mappedBy = "association")
    private List<Stand> stands;
}

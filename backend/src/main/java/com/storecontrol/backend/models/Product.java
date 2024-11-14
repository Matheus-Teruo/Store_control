package com.storecontrol.backend.models;

import com.storecontrol.backend.controllers.request.product.RequestProduct;
import com.storecontrol.backend.controllers.request.product.RequestUpdateProduct;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "products")
@Getter
@NoArgsConstructor
public class Product {
    @Id @GeneratedValue(generator = "UUID")
    private UUID uuid;
    @Column(name = "product_name")
    private String productName;
    private BigDecimal price;
    private Integer stock;
    @Column(name = "product_img")
    private String productImg;
    @ManyToOne @JoinColumn(name = "stand_uuid")
    private Stand stand;
    @OneToMany(mappedBy = "itemId.product")
    private List<Item> items;
    private Boolean valid;

    public Product(RequestProduct request, Stand stand) {
        this.productName = request.productName();
        this.price = new BigDecimal(request.price());
        this.stock = request.stock();
        if (request.productImg() != null) {
            this.productImg = request.productImg();
        }
        this.stand = stand;
        this.valid = true;
    }

    public void updateProduct(RequestUpdateProduct request) {
        if (request.productName() != null) {
            this.productName = request.productName();
        }
        if (request.price() != null) {
            this.price = new BigDecimal(request.price());
        }
        if (request.stock() != null) {
            this.stock = request.stock();
        }
        if (request.productImg() != null) {
            this.productImg = request.productImg();
        }
    }

    public void updateProduct(Stand stand) {
        this.stand = stand;
    }

    public void deleteProduct() {
        this.valid = false;
    }
}

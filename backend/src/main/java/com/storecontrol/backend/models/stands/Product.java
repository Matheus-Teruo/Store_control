package com.storecontrol.backend.models.stands;

import com.storecontrol.backend.models.stands.request.RequestCreateProduct;
import com.storecontrol.backend.models.stands.request.RequestUpdateProduct;
import com.storecontrol.backend.models.operations.purchases.Item;
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

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private int stock;

    @Column(name = "product_img")
    private String productImg;

    @ManyToOne @JoinColumn(name = "stand_uuid", nullable = false)
    private Stand stand;

    @OneToMany(mappedBy = "itemId.product")
    private List<Item> items;

    @Column(nullable = false)
    private boolean valid;


    public Product(RequestCreateProduct request, Stand stand) {
        this.productName = request.productName();
        this.price = request.price();
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
            this.price = request.price();
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

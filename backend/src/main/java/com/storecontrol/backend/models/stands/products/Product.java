package com.storecontrol.backend.models.stands.products;

import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.stands.products.request.RequestCreateProduct;
import com.storecontrol.backend.models.stands.products.request.RequestUpdateProduct;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Entity
@Table(name = "products")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id @GeneratedValue(generator = "UUID")
    private UUID uuid;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "summary")
    private String summary;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private BigDecimal discount;

    @Column(nullable = false)
    private int stock;

    @ManyToMany
    @JoinTable(
        name = "tag_product",
        joinColumns = @JoinColumn(name = "product_uuid"),
        inverseJoinColumns = @JoinColumn(name = "tag_uuid")
    )
    private List<Tag> tags;

    @Column(name = "product_img")
    private String productImg;

    @Column(name = "stand_uuid", insertable = false, updatable = false)
    private UUID standUuid;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "stand_uuid", nullable = false)
    private Stand stand;

    @OneToMany(mappedBy = "itemId.product")
    private List<Item> items;

    @Column(nullable = false)
    private boolean valid;


    public Product(RequestCreateProduct request, Stand stand) {
        this.productName = request.productName();
        if (request.summary() != null) {
            this.summary = request.summary();
        }
        if (request.description() != null) {
            this.description = request.description();
        }
        this.price = request.price();
        this.discount = BigDecimal.ZERO;
        this.stock = request.stock();
        this.tags = new ArrayList<>();
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
        this.summary = request.summary();
        this.description = request.description();
        if (request.price() != null) {
            this.price = request.price();
        }
        if (request.discount() != null) {
            this.discount = request.discount();
        }
        if (request.stock() != null) {
            this.stock = request.stock();
        }
        if (request.productImg() != null) {
            this.productImg = request.productImg();
        }
    }

    public void createTags(List<Tag> tag) {
        this.tags = tag;
    }

    public void updateTags(Set<UUID> tagsUuid, List<Tag> newTags) {
        this.tags.removeIf(existingTag -> !tagsUuid.contains(existingTag.getUuid()));

        Set<UUID> existingUuids = this.tags.stream()
            .map(Tag::getUuid)
            .collect(Collectors.toSet());

        newTags.stream()
            .filter(tag -> !existingUuids.contains(tag.getUuid()))
            .forEach(this.tags::add);
    }

    public void updateProduct(Stand stand) {
        this.stand = stand;
    }

    public void decreaseStock(Integer stock) {
        this.stock = this.stock - stock;
    }

    public void deleteProduct() {
        this.productName = this.productName + "_deleted_" + generateRandomString();
        this.valid = false;
    }

    private String generateRandomString() {
        String chars = "abcdefghijklmnopqrstuvwxyz";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();

        for (int i = 0; i < 3; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }

        return sb.toString();
    }
}

package com.storecontrol.backend.repositories.stands;

import com.storecontrol.backend.models.stands.products.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
  @Query("SELECT p FROM Product p WHERE p.valid = true AND p.uuid = :uuid")
  Optional<Product> findByUuidValidTrue(UUID uuid);

  @Query("SELECT p FROM Product p WHERE p.valid = true AND p.standUuid = :standUuid")
  List<Product> findAllValidTrueByStandUuid(UUID standUuid);

  @Query("""
    SELECT p FROM Product p
    JOIN p.tags t
    WHERE (:tagUuid IS NULL OR t.uuid = :tagUuid)
    AND p.valid = true
    AND (:name IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :name, '%')))
    AND (:standUuid IS NULL OR p.stand.uuid = :standUuid)
  """)
  Page<Product> findAllValidTruePage(String name, UUID tagUuid, UUID standUuid, Pageable pageable);

  boolean existsByProductName(String productName);
}

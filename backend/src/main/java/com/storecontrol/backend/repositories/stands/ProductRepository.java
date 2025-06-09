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

  @Query("SELECT p FROM Product p WHERE p.valid = true AND p.standUuid = :standUuid ORDER BY p.productName ASC")
  List<Product> findAllValidByStandUuid(UUID standUuid);

  @Query("SELECT p FROM Product p WHERE (:standUuid is null OR p.standUuid = :standUuid)")
  List<Product> findAllByStandUuid(UUID standUuid);

  @Query("""
    SELECT DISTINCT p FROM Product p
    LEFT JOIN p.tags t
    WHERE (:tagUuid is null OR t.uuid = :tagUuid)
    AND p.valid = true
    AND (:name is null OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :name, '%')))
    AND (:standUuid is null OR p.standUuid = :standUuid)
  """)
  Page<Product> findAllValidTruePage(String name, UUID tagUuid, UUID standUuid, Pageable pageable);

  boolean existsByProductName(String productName);

  @Query("SELECT CASE WHEN COUNT(pc) > 0 THEN true ELSE false END " +
      "FROM ProductCombo pc WHERE pc.productComboId.includedProduct.uuid = :includedProductUuid")
  boolean existsByIncludedProductUuid(UUID includedProductUuid);;
}

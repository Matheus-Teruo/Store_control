package com.storecontrol.backend.repositories.stands;

import com.storecontrol.backend.models.stands.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
  @Query("select p from Product p where p.valid = true and p.uuid = :uuid")
  Optional<Product> findByUuidValidTrue(UUID uuid);

  @Query("select p from Product p where p.valid = true")
  List<Product> findAllValidTrue();

  boolean existsByProductName(String productName);
}

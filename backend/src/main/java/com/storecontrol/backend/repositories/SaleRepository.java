package com.storecontrol.backend.repositories;

import com.storecontrol.backend.models.Good;
import com.storecontrol.backend.models.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SaleRepository extends JpaRepository<Sale, UUID> {
  @Query("select s from Sale s where s.valid = true and s.uuid = :uuid")
  Optional<Sale> findByUuidValidTrue(UUID uuid);

  @Query("select s from Sale s where s.valid = true")
  List<Sale> findAllValidTrue();

  @Query("select g from Sale s join s.goods g where s.uuid = :uuid")
  List<Good> findAllGoodsFromOneSale(UUID uuid);
}

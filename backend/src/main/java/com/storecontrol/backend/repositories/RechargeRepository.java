package com.storecontrol.backend.repositories;

import com.storecontrol.backend.models.Recharge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RechargeRepository extends JpaRepository<Recharge, UUID> {
  @Query("select r from Recharge r where r.valid = true and r.uuid = :uuid")
  Optional<Recharge> findByIdValidTrue(UUID uuid);

  @Query("select r from Recharge r where r.valid = true")
  List<Recharge> findAllByValidTrue();
}

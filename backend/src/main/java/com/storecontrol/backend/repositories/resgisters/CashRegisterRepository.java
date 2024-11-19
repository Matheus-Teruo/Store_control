package com.storecontrol.backend.repositories.resgisters;

import com.storecontrol.backend.models.registers.CashRegister;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CashRegisterRepository extends JpaRepository<CashRegister, UUID> {
  @Query("select c from CashRegister c where c.valid = true and c.uuid = :uuid")
  Optional<CashRegister> findByUuidValidTrue(UUID uuid);

  @Query("select c from CashRegister c where c.valid = true")
  List<CashRegister> findAllValidTrue();
}

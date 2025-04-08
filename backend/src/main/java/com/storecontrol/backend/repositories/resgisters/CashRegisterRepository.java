package com.storecontrol.backend.repositories.resgisters;

import com.storecontrol.backend.models.registers.CashRegister;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CashRegisterRepository extends JpaRepository<CashRegister, UUID> {
  @Query("SELECT c FROM CashRegister c WHERE c.valid = true AND c.uuid = :uuid")
  Optional<CashRegister> findByUuidValidTrue(UUID uuid);

  @Query("SELECT c FROM CashRegister c WHERE c.valid = true")
  Page<CashRegister> findAllValidTruePage(Pageable pageable);

  @Query("SELECT c FROM CashRegister c WHERE c.valid = true")
  List<CashRegister> findAllValidTrue();
}
